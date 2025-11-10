"use client";
import { cn, DraggableData, getContrastColor } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { tasks, taskStatuses } from "@/app/schema";
import CustomButton from "../ui/button";
import { Trash2, Pencil, UtensilsIcon, GripVertical, Calendar } from 'lucide-react';
import { MouseEvent } from 'react';
import { trpc } from "@/trpc/client";
import { useToast } from "../ui/toast";
import { useSortable } from "@dnd-kit/sortable";
import { cva } from "class-variance-authority";
import { Card } from "../ui/card";


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
    const handleDeleteTask = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
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
        <Card
            ref={setNodeRef}
            {...attributes}
            className={cn(
                "p-4 cursor-grab active:cursor-grabbing bg-card hover:border-primary transition-all mb-2",
                isDragging && "opacity-50 rotate-3"
            )}
        >
            <div className="flex items-start gap-2">
                <div
                    {...listeners}
                    className="mt-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                >
                    <GripVertical className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-foreground mb-2">{task.title}</h4>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{task.description}</p>

                    <div className="flex items-center gap-2 flex-wrap">

                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Calendar className="w-3 h-3" />
                            {task.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )

}


//  < div className = {`my-2 p-2 rounded shadow flex flex-row items-center transform hover:scale-105 duration-100 z-10 
//              cursor-grab active:cursor-grabbing bg-card hover:border-primary transition-all",
//              ${variants({
//             dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
//         })}`
// }
// ref = { setNodeRef }
// style = {{ ...style }}>
//             <div className="flex-grow mr-1"
//                 {...listeners}
//                 {...attributes}>
//                 <p className="text-md mb-2 font-bold">{task.title}</p>
//                 <p className="text-sm font-light">{task.description}</p>
//             </div>
//             <div className="flex flex-col justify-evenly items-stretch gap-y-2">

//                 <CustomButton variant="primary" size="sm" onClick={() => { }}><Pencil className="w-4 h-4 z-30" /></CustomButton>
//                 <CustomButton variant="destructive" size="sm" onClick={(e) => handleDeleteTask(e)}><Trash2 className="w-4 h-4 z-30" /></CustomButton>
//             </div>

//         </div >
//     )