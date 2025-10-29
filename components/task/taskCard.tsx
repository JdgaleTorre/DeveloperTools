"use client";
import { DraggableData, getContrastColor } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { tasks, taskStatuses } from "@/app/schema";
import CustomButton from "../ui/button";
import { Trash2, Pencil, UtensilsIcon } from 'lucide-react';
import { trpc } from "@/trpc/client";
import { useToast } from "../ui/toast";
import { useSortable } from "@dnd-kit/sortable";
import { cva } from "class-variance-authority";


interface TaskCardProps {
    status: InferSelectModel<typeof taskStatuses>,
    task: InferSelectModel<typeof tasks>
    isOverlay?: boolean
}

export default function TaskCard({ status, task, isOverlay }: TaskCardProps) {
    const { addToast } = useToast();
    const utils = trpc.useUtils();
    const { setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
            status: null
        } satisfies DraggableData,
        attributes: {
            roleDescription: "Task",
        },
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

    const handleDeleteTask = () => {
        if (!task.id) return;
        deleteTask({ id: task.id });
    };

    const variants = cva("", {
        variants: {
            dragging: {
                over: "ring-2 opacity-10",
                overlay: "ring-2 ring-primary",
            },
        },
    });

    return (
        <div className={`my-2 p-2 rounded shadow flex flex-row items-center cursor-pointer transform hover:scale-105 duration-100 z-10 ${variants({
            dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        })}`}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{ ...style, backgroundColor: status.color ?? 'transparent', color: getContrastColor(status.color ?? "#fff") }}>
            <div className="flex-grow">
                <p className="text-md mb-2">{task.title}</p>
                <p className="text-sm">{task.description}</p>
            </div>
            <CustomButton variant="ghost" size="sm" onClick={() => { }}><Pencil className="w-4 h-4" /></CustomButton>
            <CustomButton variant="ghost-destructive" size="sm" onClick={handleDeleteTask}><Trash2 className="w-4 h-4" /></CustomButton>

        </div>
    )
}