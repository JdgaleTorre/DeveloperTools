import { useRef, useState } from "react";
import { hasDraggableData, createAnnouncements, coordinateGetter } from "@/lib/dnd_helpers";
import { arrayMove } from "@dnd-kit/sortable";
import { taskStatuses, tasks as tasksModel, boards } from "@/app/schema";
import type { InferSelectModel } from "drizzle-orm";
import { DragEndEvent, DragOverEvent, DragStartEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { trpc } from "@/trpc/client";
import { RouterOutputs } from "@/server/api/root";


export function useBoardDnD(
    board: RouterOutputs["board"]["getById"],
    tasks: RouterOutputs["tasks"]["getBoardTasks"],
    utils: {
        tasks: { getBoardTasks: { setData: (arg0: { boardId: any; }, arg1: (old: any) => any) => void; }; };
        board: { getById: { setData: (arg0: { id: any; }, arg1: (old: any) => any) => void; }; };
    },
    updateTask: (arg0: any[]) => void,
    updateStatuses: (arg0: any) => void,
    boardId: string,
    setRerenderKey: (arg0: (prev: any) => any) => void) {
    const [activeTask, setActiveTask] =
        useState<InferSelectModel<typeof tasksModel> | null>(null);
    const [activeStatus, setActiveStatus] =
        useState<InferSelectModel<typeof taskStatuses> | null>(null);

    const pickedUpTaskColumn = useRef<string | null>(null);

    const announcements = createAnnouncements(tasks ?? [], board?.taskStatuses ?? [], pickedUpTaskColumn);

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: coordinateGetter,
        })
    );

    function onDragStart(event: DragStartEvent) {
        if (!hasDraggableData(event.active)) return;
        const data = event.active.data.current;
        if (data?.type === "Status") {
            setActiveStatus(data.status ?? null);
            setActiveTask(null);
        } else if (data?.type === "Task") {
            setActiveTask(data.task ?? null);
            setActiveStatus(null);
            pickedUpTaskColumn.current = data.task?.statusId ?? null;
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

    return {
        activeTask,
        activeStatus,
        onDragStart,
        announcements,
        onDragOver,
        onDragEnd,
        sensors
    };
}
