"use client";
import { getContrastColor } from "@/lib/utils";
import { InferInsertModel } from "drizzle-orm";
import { tasks, taskStatuses } from "@/app/schema";
import CustomButton from "../ui/button";
import { Trash2, Pencil, UtensilsIcon } from 'lucide-react';
import { trpc } from "@/trpc/client";
import { useToast } from "../ui/toast";



export default function TaskCard({ status, task }: { status: InferInsertModel<typeof taskStatuses>, task: InferInsertModel<typeof tasks> }) {
    const { addToast } = useToast();
    const utils = trpc.useUtils();

    const { mutate: deleteTask } = trpc.tasks.delete.useMutation({
        onSuccess: async () => {
            addToast({ title: "Task deleted", description: "The task has been deleted successfully.", variant: "success" });
            await utils.tasks.getBoardTasks.invalidate({ boardId: task.boardId! });
        }
    });

    const handleDeleteTask = () => {
        if (!task.id) return;
        deleteTask({ id: task.id });
    };
    return (
        <div className="my-2 p-2 rounded shadow flex flex-row items-center cursor-pointer transform hover:scale-105 duration-100" style={{ backgroundColor: status.color ?? 'transparent', color: getContrastColor(status.color ?? "#fff"), }}>
            <div className="flex-grow">
                <p className="text-md mb-2">{task.title}</p>
                <p className="text-sm">{task.description}</p>
            </div>
            <CustomButton variant="ghost" size="sm" onClick={() => { }}><Pencil className="w-4 h-4" /></CustomButton>
            <CustomButton variant="ghost-destructive" size="sm" onClick={handleDeleteTask}><Trash2 className="w-4 h-4" /></CustomButton>

        </div>
    )
}