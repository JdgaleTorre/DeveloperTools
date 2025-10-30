import { Active, Announcements, DataRef, Over, UniqueIdentifier } from "@dnd-kit/core";
import { DraggableData } from "./utils";
import { InferSelectModel } from "drizzle-orm";
import { tasks as tasksModel, taskStatuses } from "@/app/schema"


export function hasDraggableData<T extends Active | Over>(
    entry: T | null | undefined
): entry is T & {
    data: DataRef<DraggableData>;
} {
    if (!entry) {
        return false;
    }

    const data = entry.data.current;

    if (data?.type === "Status" || data?.type === "Task") {
        return true;
    }

    return false;
}

function getDraggingTaskData(
    tasks: InferSelectModel<typeof tasksModel>[],
    statuses: InferSelectModel<typeof taskStatuses>[],
    taskId: UniqueIdentifier,
    statusId: string) {
    const tasksInColumn = tasks.filter((task) => task.statusId === statusId);
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = statuses.find((col) => col.id === statusId);
    return {
        tasksInColumn,
        taskPosition,
        column,
    };
}

export function createAnnouncements(
    tasks: InferSelectModel<typeof tasksModel>[],
    statuses: InferSelectModel<typeof taskStatuses>[],
    pickedUpTaskColumn: React.MutableRefObject<string | null>
) {

    const announcements: Announcements = {
        onDragStart({ active }) {
            if (!hasDraggableData(active)) return;
            if (active.data.current?.type === "Status") {
                const startColumnIdx = statuses.findIndex(({ id }) => id === active.id);
                const startColumn = statuses[startColumnIdx];
                return `Picked up Column ${startColumn?.name} at position: ${startColumnIdx + 1
                    } of ${statuses.length}`;
            } else if (active.data.current?.type === "Task") {
                pickedUpTaskColumn.current = active.data.current.task?.statusId ?? '';
                const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
                    tasks,
                    statuses,
                    active.id,
                    pickedUpTaskColumn.current
                );
                return `Picked up Task ${active.data.current.task?.title
                    } at position: ${taskPosition + 1} of ${tasksInColumn.length
                    } in column ${column?.name}`;
            }
        },
        onDragOver({ active, over }) {
            if (!hasDraggableData(active) || !hasDraggableData(over)) return;

            if (
                active.data.current?.type === "Status" &&
                over.data.current?.type === "Status"
            ) {
                const overColumnIdx = statuses.findIndex(({ id }) => id === over.id);
                return `Column ${active.data.current.status?.name} was moved over ${over.data.current.status?.name
                    } at position ${overColumnIdx + 1} of ${statuses.length}`;
            } else if (
                active.data.current?.type === "Task" &&
                over.data.current?.type === "Task"
            ) {
                const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
                    tasks,
                    statuses,
                    over.id,
                    over.data.current.task?.statusId ?? ''
                );
                if (over.data.current.task?.statusId !== pickedUpTaskColumn.current) {
                    return `Task ${active.data.current.task?.title
                        } was moved over column ${column?.name} in position ${taskPosition + 1
                        } of ${tasksInColumn.length}`;
                }
                return `Task was moved over position ${taskPosition + 1} of ${tasksInColumn.length
                    } in column ${column?.name}`;
            }
        },
        onDragEnd({ active, over }) {
            if (!hasDraggableData(active) || !hasDraggableData(over)) {
                pickedUpTaskColumn.current = null;
                return;
            }
            if (
                active.data.current?.type === "Status" &&
                over.data.current?.type === "Status"
            ) {
                const overColumnPosition = statuses.findIndex(({ id }) => id === over.id);

                return `Column ${active.data.current.status?.name
                    } was dropped into position ${overColumnPosition + 1} of ${statuses.length
                    }`;
            } else if (
                active.data.current?.type === "Task" &&
                over.data.current?.type === "Task"
            ) {
                const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
                    tasks,
                    statuses,
                    over.id,
                    over.data.current.task?.title ?? ''
                );
                if (over.data.current.task?.statusId !== pickedUpTaskColumn.current) {
                    return `Task was dropped into column ${column?.name} in position ${taskPosition + 1
                        } of ${tasksInColumn.length}`;
                }
                return `Task was dropped into position ${taskPosition + 1} of ${tasksInColumn.length
                    } in column ${column?.name}`;
            }
            pickedUpTaskColumn.current = null;
        },
        onDragCancel({ active }) {
            pickedUpTaskColumn.current = null;
            if (!hasDraggableData(active)) return;
            return `Dragging ${active.data.current?.type} cancelled.`;
        },
    };

    return announcements;
}


import {
    closestCorners,
    getFirstCollision,
    KeyboardCode,
    DroppableContainer,
    KeyboardCoordinateGetter,
} from "@dnd-kit/core";

const directions: string[] = [
    KeyboardCode.Down,
    KeyboardCode.Right,
    KeyboardCode.Up,
    KeyboardCode.Left,
];

export const coordinateGetter: KeyboardCoordinateGetter = (
    event,
    { context: { active, droppableRects, droppableContainers, collisionRect } }
) => {
    if (directions.includes(event.code)) {
        event.preventDefault();

        if (!active || !collisionRect) {
            return;
        }

        const filteredContainers: DroppableContainer[] = [];

        droppableContainers.getEnabled().forEach((entry) => {
            if (!entry || entry?.disabled) {
                return;
            }

            const rect = droppableRects.get(entry.id);

            if (!rect) {
                return;
            }

            const data = entry.data.current;

            if (data) {
                const { type, children } = data;

                if (type === "Status" && children?.length > 0) {
                    if (active.data.current?.type !== "Status") {
                        return;
                    }
                }
            }

            switch (event.code) {
                case KeyboardCode.Down:
                    if (active.data.current?.type === "Status") {
                        return;
                    }
                    if (collisionRect.top < rect.top) {
                        // find all droppable areas below
                        filteredContainers.push(entry);
                    }
                    break;
                case KeyboardCode.Up:
                    if (active.data.current?.type === "Status") {
                        return;
                    }
                    if (collisionRect.top > rect.top) {
                        // find all droppable areas above
                        filteredContainers.push(entry);
                    }
                    break;
                case KeyboardCode.Left:
                    if (collisionRect.left >= rect.left + rect.width) {
                        // find all droppable areas to left
                        filteredContainers.push(entry);
                    }
                    break;
                case KeyboardCode.Right:
                    // find all droppable areas to right
                    if (collisionRect.left + collisionRect.width <= rect.left) {
                        filteredContainers.push(entry);
                    }
                    break;
            }
        });
        const collisions = closestCorners({
            active,
            collisionRect: collisionRect,
            droppableRects,
            droppableContainers: filteredContainers,
            pointerCoordinates: null,
        });
        const closestId = getFirstCollision(collisions, "id");

        if (closestId != null) {
            const newDroppable = droppableContainers.get(closestId);
            const newNode = newDroppable?.node.current;
            const newRect = newDroppable?.rect.current;

            if (newNode && newRect) {
                return {
                    x: newRect.left,
                    y: newRect.top,
                };
            }
        }
    }

    return undefined;
};