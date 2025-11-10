"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";
import { trpc } from "@/trpc/client";
import StatusColumn from "@/components/boards/statusColumn";
import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensors,
    useSensor,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
    coordinateGetter,
    createAnnouncements,
    hasDraggableData,
} from "@/lib/dnd_helpers";
import { InferSelectModel } from "drizzle-orm";
import { taskStatuses, tasks as tasksModel } from "@/app/schema";
import TaskCard from "../task/taskCard";
import CustomButton from "../ui/button";
import { API_TASK_CREATE_ENDPOINT, BACKLOGCOLOR, BACKLOGID, BACKLOGNAME } from "@/lib/utils";
import { AIAgentPopup } from "../ai/popup-agent";
import { AITaskResponse } from "@/lib/ai";
import { TaskList } from "../ai/taskList";
import { useBoardData } from "@/hooks/useBoardData";
import { useBoardDnD } from "@/hooks/useDnDBoard";
import { BoardColumns } from "./boardColumns";



export default function BoardComponent({ boardId }: { boardId: string }) {
    const {
        board,
        tasks,
        updateStatuses,
        updateTask,
        insertManyTasks,
        utils,
        rerenderKey,
        setRerenderKey,
    } = useBoardData(boardId);

    const { activeTask, activeStatus, onDragStart, announcements, onDragEnd, onDragOver, sensors } = useBoardDnD(
        board ?? null,
        tasks ?? [],
        utils,
        updateTask,
        updateStatuses,
        boardId,
        setRerenderKey
    );


    function createNewStatus() {
        utils.board.getById.setData({ id: boardId }, (old) => {
            if (!old) return old;

            setRerenderKey((k) => k + 1)
            const newStatues = [...old.taskStatuses, { id: '', name: '', boardId: boardId, color: "#FFFFFF", position: old.taskStatuses.length + 1, createdAt: new Date() }]

            return { ...old, taskStatuses: newStatues }
        })
    }

    if (!board) return

    // ─────────────────────────────
    // 🖥️ Render
    // ─────────────────────────────
    return (
        <div>
            <h1 className="text-2xl font-bold text-left">Board {board?.name}</h1>
            <p className="mt-2 text-left">Description: {board?.description}</p>

            <div className="mt-4 pt-2  flex wrap-normal gap-4 items-start overflow-x-auto overflow-y-hidden h-full  
            scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-muted hover:scrollbar-thumb-accent rounded-xl">
                <DndContext
                    accessibility={{ announcements }}
                    sensors={sensors}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragOver={onDragOver}
                >
                    <SortableContext items={board.taskStatuses.map((s) => s.id)}>
                        <BoardColumns
                            board={board}
                            tasks={tasks ?? []}
                            rerenderKey={rerenderKey}
                            boardId={boardId}
                            createNewStatus={() => setRerenderKey((k) => k + 1)}
                        />
                    </SortableContext>
                    <DragOverlay>
                        {activeTask ? <TaskCard isOverlay status={board?.taskStatuses.find((status) => status.id === activeTask.statusId) ?? {
                            boardId: "",
                            name: "",
                            id: "",
                            createdAt: new Date(),
                            color: "",
                            position: 0,
                        }} task={activeTask} /> : null}
                        {activeStatus ? <StatusColumn
                            isOverlay
                            status={activeStatus}
                            tasksList={
                                tasks?.filter((task) => task.statusId === activeStatus.id) ?? []
                            }
                            statusLength={board.taskStatuses.length}
                        /> : null}

                    </DragOverlay>
                </DndContext>
                <AIAgentPopup<AITaskResponse>
                    firstMessage="Hi! I'm your AI project assistant. Describe your project or idea, and I'll break it down into actionable tasks for your Kanban board. 🚀"
                    apiEndPoint={API_TASK_CREATE_ENDPOINT}
                    responseMessage={(data) => `I've generated ${data.tasks.length} tasks for your project. Review them below and select which ones you'd like to add to your board.`}
                    responseHandler={(data, onAccept, onReject) => (
                        <TaskList
                            data={data}
                            onAccept={(selectedTasks) => {
                                console.log("Accepted:", selectedTasks)
                                insertManyTasks(selectedTasks.map((t) => ({ ...t, boardId: boardId })))
                                onAccept() // clears popup

                            }}
                            onReject={onReject}
                        />
                    )}
                />
            </div>
        </div >
    );
}
