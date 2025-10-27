"use client";
import StatusColumn from "@/components/boards/statusColumn";
import { coordinateGetter, createAnnouncements, hasDraggableData } from "@/lib/dnd_helpers";
import { trpc } from "@/trpc/client";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensors, useSensor, DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { InferSelectModel } from "drizzle-orm";
import { useEffect, useRef, useState } from "react";
import { taskStatuses, tasks as tasksModel } from '@/app/schema'

export default function BoardComponent({ boardId }: { boardId: string }) {
    const { data: board } = trpc.board.getById.useQuery({ id: boardId });
    const { data: tasksList } = trpc.tasks.getBoardTasks.useQuery({ boardId });
    const pickedUpTaskColumn = useRef<string | null>(null);

    const announcements = createAnnouncements(tasksList ?? [], board?.taskStatuses ?? [], pickedUpTaskColumn);
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: coordinateGetter,
        })
    );

    const [status, setStatus] = useState<InferSelectModel<typeof taskStatuses>[]>()
    const [activeTask, setActiveTask] = useState<InferSelectModel<typeof tasksModel> | null>()
    const [activeStatus, setActiveStatus] = useState<InferSelectModel<typeof taskStatuses> | null>();
    const [tasks, setTasks] = useState<InferSelectModel<typeof tasksModel>[]>()

    useEffect(() => {
        setTasks(tasksList as InferSelectModel<typeof tasksModel>[])
    }, [tasksList])

    if (!board) return <div>There is no board</div>

    function onDragStart(event: DragStartEvent) {
        if (!hasDraggableData(event.active)) return;
        const data = event.active.data.current;
        if (data?.type === "Status") {
            setActiveStatus(data.status ?? null);
            return;
        }

        if (data?.type === "Task") {
            setActiveTask(data.task ?? null);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || !hasDraggableData(active) || !hasDraggableData(over)) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        // reset local drag state
        setActiveStatus(null);
        setActiveTask(null);

        // only handle tasks
        if (activeData?.type !== "Task") return;

        const activeId = active.id;
        const overId = over.id;

        // Dropped over a task
        if (overData?.type === "Task") {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);
                const updated = [...tasks];

                const activeTask = updated[activeIndex];
                const overTask = updated[overIndex];

                if (activeTask && overTask && activeTask.statusId !== overTask.statusId) {
                    activeTask.statusId = overTask.statusId;
                }

                return arrayMove(updated, activeIndex, overIndex);
            });
        }

        // Dropped over a column
        if (overData?.type === "Status") {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const updated = [...tasks];
                const activeTask = updated[activeIndex];

                if (activeTask) {
                    activeTask.statusId = overId as string;
                }

                return updated;
            });
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        if (!hasDraggableData(active) || !hasDraggableData(over)) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        // Only handle tasks
        if (activeData?.type !== "Task") return;

        const activeId = active.id;
        const overId = over.id;

        // Moving a task over another task
        if (overData?.type === "Task") {
            setTasks((prev) => {
                const oldIndex = prev.findIndex((t) => t.id === activeId);
                const newIndex = prev.findIndex((t) => t.id === overId);
                if (oldIndex === -1 || newIndex === -1) return prev;

                // Create a shallow copy
                const updated = [...prev];
                const activeTask = updated[oldIndex];
                const overTask = updated[newIndex];

                // If the column changes while dragging
                if (activeTask.statusId !== overTask.statusId) {
                    activeTask.statusId = overTask.statusId;
                }

                // Move visually
                return arrayMove(updated, oldIndex, newIndex);
            });
        }

        // Moving a task over an empty column
        if (overData?.type === "Status") {
            setTasks((prev) => {
                const oldIndex = prev.findIndex((t) => t.id === activeId);
                if (oldIndex === -1) return prev;
                const updated = [...prev];
                updated[oldIndex].statusId = overId as string;
                return updated;
            });
        }
    }



    return (
        <div className="p-4 w-full max-w-4xl mx-auto h-full">
            <h1 className="text-2xl font-bold text-left">Board {board?.name}</h1>
            <p className="mt-2 text-left">Description: {board?.description}</p>

            <div className="mt-6 w-full flex gap-4 items-start">
                <DndContext
                    accessibility={{
                        announcements,
                    }}
                    sensors={sensors}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragOver={onDragOver}
                >
                    <SortableContext items={board?.taskStatuses.map((status) => status.id)}>
                        {board?.taskStatuses.map((status) => (
                            <StatusColumn
                                key={status.id}
                                status={status}
                                tasksList={tasks?.filter((task) => task.statusId === status.id).length ? tasks.filter((task) => task.statusId === status.id) : []}
                                statusLength={board.taskStatuses.length}
                            />
                        ))}
                    </SortableContext>
                </DndContext>


            </div>
        </div>
    );
}
