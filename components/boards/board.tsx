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



export default function BoardComponent({ boardId }: { boardId: string }) {
    const utils = trpc.useUtils();

    // ✅ Queries
    const { data: board } = trpc.board.getById.useQuery({ id: boardId });
    const { data: initialTasks } = trpc.tasks.getBoardTasks.useQuery({ boardId });

    // ✅ Mutation for task updates
    const { mutate: updateTask } = trpc.tasks.updateMany.useMutation({
        onSuccess: async () => {
            await utils.tasks.getBoardTasks.invalidate({ boardId });
        },
    });

    // ✅ Local state for tasks (optimistic UI)
    const [tasks, setTasks] = useState<InferSelectModel<typeof tasksModel>[]>([]);
    const [activeTask, setActiveTask] =
        useState<InferSelectModel<typeof tasksModel> | null>(null);
    const [activeStatus, setActiveStatus] =
        useState<InferSelectModel<typeof taskStatuses> | null>(null);

    // ✅ Initialize once when data loads
    useEffect(() => {
        // Only update local state when we *first* receive tasks or when task count changes
        if (initialTasks) {
            console.log('New Initials', initialTasks)
            setTasks(initialTasks);
        }
    }, [initialTasks]);

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
            return;
        }

        if (data?.type === "Task") {
            setActiveTask(data.task ?? null);
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

        // Only handle tasks
        if (activeData?.type !== "Task") return;

        const activeId = active.id;
        const overId = over.id;

        // Moving task over another task
        if (overData?.type === "Task") {
            setTasks((prev) => {
                const oldIndex = prev.findIndex((t) => t.id === activeId);
                const newIndex = prev.findIndex((t) => t.id === overId);
                if (oldIndex === -1 || newIndex === -1) return prev;

                const updated = [...prev];
                const activeTask = updated[oldIndex];
                const overTask = updated[newIndex];

                // If the column changes while dragging
                if (activeTask.statusId !== overTask.statusId) {
                    activeTask.statusId = overTask.statusId;
                }

                return arrayMove(updated, oldIndex, newIndex);
            });
        }

        // Moving task over an empty column
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

    // ─────────────────────────────
    // 🟥 DRAG END
    // (update server + reset state)
    // ─────────────────────────────
    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveStatus(null);
        setActiveTask(null);

        if (!over || !hasDraggableData(active) || !hasDraggableData(over)) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (activeData?.type === "Task") {
            let newStatus = activeData.task?.statusId

            if (overData?.type == "Status") {
                newStatus = overData.status?.id

            }

            const changedTasks: InferSelectModel<typeof tasksModel>[] = [];

            tasks.forEach((task, i) => {
                const original = initialTasks?.find((t) => t.id === task.id);
                const newPosition = i + 1;
                const positionChanged = task.position !== newPosition;
                const statusChanged = task.statusId !== newStatus;

                if (positionChanged || statusChanged) {
                    changedTasks.push({ ...task, position: newPosition, statusId: newStatus ?? '' });
                }
            });

            if (changedTasks.length > 0) {
                console.log("changedTasks ->", changedTasks);
                updateTask(
                    changedTasks.map((task) => ({
                        ...task,
                        description: task.description ?? "",
                    }))
                );
            }
        }
    }


    // ─────────────────────────────
    // 🖥️ Render
    // ─────────────────────────────
    return (
        <div className="p-4 w-full max-w-4xl mx-auto h-full">
            <h1 className="text-2xl font-bold text-left">Board {board?.name}</h1>
            <p className="mt-2 text-left">Description: {board?.description}</p>

            <div className="mt-6 w-full flex gap-4 items-start">
                <DndContext
                    accessibility={{ announcements }}
                    sensors={sensors}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragOver={onDragOver}
                >
                    <SortableContext items={board.taskStatuses.map((s) => s.id)}>
                        {board.taskStatuses.map((status) => (
                            <StatusColumn
                                key={status.id}
                                status={status}
                                tasksList={
                                    tasks.filter((task) => task.statusId === status.id) ?? []
                                }
                                statusLength={board.taskStatuses.length}
                            />
                        ))}
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
                                tasks.filter((task) => task.statusId === activeStatus.id) ?? []
                            }
                            statusLength={board.taskStatuses.length}
                        /> : null}

                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}
