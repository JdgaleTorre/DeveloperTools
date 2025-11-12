"use client";
import { cn, DraggableData, getContrastColor } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { tasks, taskStatuses } from "@/app/schema";
import { GripVertical, Calendar, EllipsisVertical, Ellipsis, Trash2 } from 'lucide-react';
import { MouseEvent, useState } from 'react';
import { trpc } from "@/trpc/client";
import { useToast } from "../ui/toast";
import { useSortable } from "@dnd-kit/sortable";
import { cva } from "class-variance-authority";
import { Card } from "../ui/card";
import CustomInput from "../ui/input";
import Button from "../ui/button";
import { ContextMenu, ContextMenuItem } from "../ui/context_menu";


interface TaskCardProps {
    status: InferSelectModel<typeof taskStatuses>,
    task: InferSelectModel<typeof tasks>,
    isOverlay?: boolean,
    newTask?: boolean,
}

export default function TaskCard({ status, task, isOverlay, newTask }: TaskCardProps) {
    const { addToast } = useToast();
    const utils = trpc.useUtils();
    const [taskState, setTaskState] = useState({ title: task.title, description: task.description });
    const { setNodeRef, attributes, listeners, transform, transition, isDragging,
    } = useSortable({
        id: task.id, data: { type: "Task", task, status: null } satisfies DraggableData, attributes: { roleDescription: "Task", },
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const { mutate: deleteTask } = trpc.tasks.delete.useMutation({
        onSuccess: async () => {
            addToast({ title: "Task deleted", description: "The task has been deleted successfully.", variant: "success" });
            await utils.tasks.getBoardTasks.invalidate({ boardId: task.boardId! });
        },
        onError: (error) => {
            addToast({ title: "Error deleting task", description: error.message, variant: "error" });
        }
    });

    const { mutate: insertUpdateTaks } = trpc.tasks.insertMany.useMutation({
        onSuccess: async () => {
            // utils.board.getById.invalidate({ id: board.id! });
            await utils.tasks.getBoardTasks.invalidate({ boardId: task.boardId });
        }
    });
    const handleDeleteTask = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!task.id) return;
        deleteTask({ id: task.id });
    };

    const variants = cva("", {
        variants: {
            dragging: {
                over: "ring-2 opacity-50",
                overlay: "ring-2 ring-primary rotate-3",
            },
        },
    });

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleChange();
        }
    };

    const handleChange = () => {
        console.log(taskState.title, status.id)
        if (!taskState.title || !status.id) return;
        insertUpdateTaks([{ title: taskState.title, description: taskState.description ?? '', statusId: status.id, boardId: task.boardId }]);
    }

    const menuItems = [
        {
            label: "Delete",
            icon: (
                <Trash2 />
            ),
            onClick: () => {
                if (!task.id) return;
                deleteTask({ id: task.id });
            },
        },
        // { divider: true }
    ]

    return (
        <Card
            ref={setNodeRef}
            {...attributes}
            className={cn(
                "p-4 cursor-grab active:cursor-grabbing bg-card hover:border-primary transition-all mb-2 group",
                variants({
                    dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
                }),
            )
            }
            style={style}
        >
            <div className="flex items-start gap-2">
                <div
                    {...listeners}
                    className="mt-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                >
                    <GripVertical className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 relative">
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ContextMenu items={menuItems as ContextMenuItem[]}>
                            <Button size="xs" variant="primary">
                                <Ellipsis />
                            </Button>
                        </ContextMenu>

                    </div>
                    {!newTask ? (
                        <>
                            <h4 className="text-foreground mb-2">{task.title}</h4>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{task.description}</p>
                        </>
                    )
                        : (
                            <>
                                <CustomInput variant="ghost" inputSize="sm" placeholder="New Task" autoFocus
                                    value={taskState.title} onChange={(e) => setTaskState((task) => ({ ...task, title: e.target.value }))}
                                    onKeyDown={handleKeyPress} />
                                <CustomInput variant="ghost" inputSize="sm" placeholder="Description" className="mb-3"
                                    value={taskState.description!} onChange={(e) => setTaskState((task) => ({ ...task, description: e.target.value }))}
                                    onKeyDown={handleKeyPress} />
                            </>
                        )}


                    <div className="flex items-center gap-2 flex-wrap">

                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Calendar className="w-3 h-3" />
                            {task.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>
        </Card >
    )

}
