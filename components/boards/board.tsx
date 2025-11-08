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



export default function BoardComponent({ boardId }: { boardId: string }) {
    const utils = trpc.useUtils();

    // ✅ Queries
    const { data: board } = trpc.board.getById.useQuery({ id: boardId });
    const { data: tasks } = trpc.tasks.getBoardTasks.useQuery({ boardId });

    const [rerenderKey, setRerenderKey] = useState(0);

    const { mutate: updateStatuses } = trpc.taskStatuses.updateMany.useMutation({
        onSuccess: async () => {
            await utils.tasks.getBoardTasks.invalidate({ boardId });
        },
    })

    const { mutate: insertManyTasks } = trpc.tasks.insertMany.useMutation({
        onSuccess: async () => {
            await utils.tasks.getBoardTasks.invalidate({ boardId });
        },
    });

    // ✅ Mutation for task updates
    const { mutate: updateTask } = trpc.tasks.updateMany.useMutation({
        onSuccess: async () => {
            await utils.tasks.getBoardTasks.invalidate({ boardId });
        },
        onMutate: async (updatedTasks) => {
            await utils.tasks.getBoardTasks.cancel({ boardId });

            // Snapshot previous value
            const previousTasks = utils.tasks.getBoardTasks.getData({ boardId });

            // Optimistically update cache
            utils.tasks.getBoardTasks.setData({ boardId }, (old) => {
                if (!old) {
                    // No existing cache — synthesize createdAt and normalize description for the optimistic items
                    return updatedTasks.map((u) => ({
                        ...u,
                        description: u.description ?? null,
                        createdAt: new Date(),
                        statusId: u.statusId ?? null,
                    }));
                }
                const updatedIds = updatedTasks.map((t) => t.id);
                return old.map((t) =>
                    updatedIds.includes(t.id)
                        ? (() => {
                            const found = updatedTasks.find((u) => u.id === t.id)!;
                            // Preserve createdAt from the cached item and normalize description
                            return {
                                ...t,
                                ...found,
                                description: found.description ?? t.description ?? null,
                                createdAt: t.createdAt,
                                statusId: t.statusId ?? null,
                            };
                        })()
                        : t
                );
            });

            // Return rollback context
            return { previousTasks };
        },

        // If the mutation fails, rollback
        onError: (_err, _vars, context) => {
            if (context?.previousTasks) {
                utils.tasks.getBoardTasks.setData({ boardId }, context.previousTasks);
            }
        },

        // After success, revalidate
        onSettled: async () => {
            await utils.tasks.getBoardTasks.invalidate({ boardId });
        },
    });

    const [activeTask, setActiveTask] =
        useState<InferSelectModel<typeof tasksModel> | null>(null);
    const [activeStatus, setActiveStatus] =
        useState<InferSelectModel<typeof taskStatuses> | null>(null);


    // ✅ Ref for tracking where the dragged task came from
    const pickedUpTaskColumn = useRef<string | null>(null);

    // ✅ DnD sensors
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: coordinateGetter,
        })
    );

    const announcements = createAnnouncements(
        tasks ?? [],
        board?.taskStatuses ?? [],
        pickedUpTaskColumn
    );

    if (!board) return <div>There is no board</div>;

    // ─────────────────────────────
    // 🟦 DRAG START
    // ─────────────────────────────
    function onDragStart(event: DragStartEvent) {
        if (!hasDraggableData(event.active)) return;
        const data = event.active.data.current;

        if (data?.type === "Status") {
            setActiveStatus(data.status ?? null);
            setActiveTask(null);
            return;
        }

        if (data?.type === "Task") {
            setActiveTask(data.task ?? null);
            setActiveStatus(null);
            pickedUpTaskColumn.current = data.task?.statusId ?? null;
            return;
        }
    }

    // ─────────────────────────────
    // 🟩 DRAG OVER
    // (purely local / visual update)
    // ─────────────────────────────
    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        if (!hasDraggableData(active) || !hasDraggableData(over)) return;

        const activeData = active.data.current;
        const overData = over.data.current;
        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeData?.type === "Task") {

            utils.tasks.getBoardTasks.setData({ boardId }, (old) => {
                if (!old) return old;
                const updated = [...old];
                const activeIndex = updated.findIndex((t) => t.id === activeId);
                if (activeIndex === -1) return old;

                const activeTask = updated[activeIndex];

                // 🟢 Moving over another task
                if (overData?.type === "Task") {
                    const overIndex = updated.findIndex((t) => t.id === overId);
                    if (overIndex === -1) return old;

                    const overTask = updated[overIndex];

                    // If moved to a different column
                    if (activeTask.statusId !== overTask.statusId) {
                        activeTask.statusId = overTask.statusId;
                    }

                    // Visually reorder
                    const reordered = arrayMove(updated, activeIndex, overIndex);

                    // Normalize positions
                    board?.taskStatuses.forEach((status) => {
                        const columnTasks = reordered
                            .filter((t) => t.statusId === status.id)
                            .sort((a, b) => a.position - b.position);
                        columnTasks.forEach((t, i) => (t.position = i + 1));
                    });

                    return reordered;
                }

                // 🟣 Moving over an empty column
                if (overData?.type === "Status") {
                    activeTask.statusId = overData.status?.id ?? '';

                    // Recompute all positions
                    board?.taskStatuses.forEach((status) => {
                        const columnTasks = updated
                            .filter((t) => t.statusId === status.id)
                            .sort((a, b) => a.position - b.position);
                        columnTasks.forEach((t, i) => (t.position = i + 1));
                    });

                    setRerenderKey((prev) => prev + 1)

                    return updated;
                }

                return old;
            });

        }

        if (activeData?.type === "Status") {
            utils.board.getById.setData({ id: boardId }, (old) => {
                if (!old) return old;

                const updated = [...old.taskStatuses]

                const activeIndex = updated.findIndex((t) => t.id === activeId);
                if (activeIndex === -1) return old;

                const activeStatus = updated[activeIndex]

                // Moving Over Status
                if (overData?.type === "Status") {
                    const overIndex = updated.findIndex((t) => t.id === overId);
                    if (overIndex === -1) return old;

                    // Visually reorder
                    const reordered = arrayMove(updated, activeIndex, overIndex);

                    // Recompute all Status Positions
                    reordered.map((val, i) => {
                        val.position = i + 1;
                    })

                    return { ...old, taskStatuses: reordered }
                }


                return old;

            })
        }


    }


    // ─────────────────────────────
    // 🟥 DRAG END
    // (update server + reset state)
    // ─────────────────────────────
    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || !hasDraggableData(active) || !hasDraggableData(over)) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (activeData?.type === "Task") {
            if (!tasks) return;

            // Clone tasks for manipulation
            const newTasks = [...tasks];
            const activeTask = newTasks.find((t) => t.id === active.id);
            if (!activeTask) return;

            // Example: drop into empty column
            if (overData?.type === "Status") {
                activeTask.statusId = overData.status?.id ?? '';
                activeTask.position = 1;
            }

            // Example: drop over another task
            else if (overData?.type === "Task") {
                const overTask = newTasks.find((t) => t.id === over.id);
                if (overTask) {
                    activeTask.statusId = overTask.statusId;
                    // reorder logic here...
                }
            }

            // Normalize positions
            board?.taskStatuses.forEach((status) => {
                const columnTasks = newTasks
                    .filter((t) => t.statusId === status.id)
                    .sort((a, b) => a.position - b.position);
                columnTasks.forEach((t, i) => (t.position = i + 1));
            });

            // 🚀 Optimistic update via tRPC
            updateTask(
                newTasks.map((t) => ({
                    ...t,
                    description: t.description ?? "",
                    statusId: t.statusId ?? undefined,
                }))
            );
        }

        if (activeData?.type === 'Status' && board) {
            updateStatuses(board.taskStatuses.map((val) => ({ ...val, color: val.color ?? '' })))

        }
    }

    function createNewStatus() {
        utils.board.getById.setData({ id: boardId }, (old) => {
            if (!old) return old;

            setRerenderKey((k) => k + 1)
            const newStatues = [...old.taskStatuses, { id: '', name: '', boardId: boardId, color: "#FFFFFF", position: old.taskStatuses.length + 1, createdAt: new Date() }]

            return { ...old, taskStatuses: newStatues }
        })
    }

    // ─────────────────────────────
    // 🖥️ Render
    // ─────────────────────────────
    return (
        <div>
            <h1 className="text-2xl font-bold text-left">Board {board?.name}</h1>
            <p className="mt-2 text-left">Description: {board?.description}</p>

            <div className="my-6 py-4  flex wrap-normal gap-4 items-start overflow-x-auto overflow-y-hidden scroll-mx-5 
            scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-background dark:scrollbar-track-background-dark hover:scrollbar-thumb-accent rounded-xl">
                <DndContext
                    accessibility={{ announcements }}
                    sensors={sensors}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragOver={onDragOver}
                >
                    <SortableContext items={board.taskStatuses.map((s) => s.id)}>
                        {(tasks ?? []).filter((task) => task.statusId === null).length >= 0 && (
                            <StatusColumn
                                key={`null-${rerenderKey}`}
                                status={{
                                    boardId: boardId,
                                    name: BACKLOGNAME,
                                    id: BACKLOGID,
                                    createdAt: new Date(),
                                    color: BACKLOGCOLOR,
                                    position: 0,
                                }}
                                tasksList={
                                    tasks?.filter((task) => task.statusId === null) ?? []
                                }
                                statusLength={board.taskStatuses.length}
                                notShowActionHeaders
                            />
                        )}


                        {board.taskStatuses.map((status) => (
                            <StatusColumn
                                key={`${status.id}-${rerenderKey}`}
                                status={status}
                                tasksList={
                                    tasks?.filter((task) => task.statusId === status.id) ?? []
                                }
                                statusLength={board.taskStatuses.length}
                            />
                        ))}

                        <div className="min-w-44">
                            <CustomButton variant="ghost" onClick={() => createNewStatus()}>+ New Status</CustomButton>

                        </div>


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
                {/* <AIChatPopup /> */}
                <AIAgentPopup<AITaskResponse>
                    label="Create Tasks with AI Agent"
                    labelPreview="Suggested Tasks"
                    placeholder="Describe the tasks or project"
                    apiEndPoint={API_TASK_CREATE_ENDPOINT}
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
