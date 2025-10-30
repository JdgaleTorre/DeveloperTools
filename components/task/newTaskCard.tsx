"use client";
import { getContrastColor } from "@/lib/utils";
import CustomButton from "../ui/button";
import CustomInput from "../ui/input";
import { InferSelectModel } from "drizzle-orm";
import { boards, taskStatuses } from "@/app/schema";
import { useState } from "react";
import { trpc } from "@/trpc/client";


export default function NewTaskCard({ status, board, cancelFn }: { status: InferSelectModel<typeof taskStatuses>, board: InferSelectModel<typeof boards>, cancelFn: () => void }) {
    const [task, setTask] = useState({ title: "", description: "" });
    const utils = trpc.useUtils();
    const { mutate } = trpc.tasks.insert.useMutation({
        onSuccess: async () => {
            setTask({ title: "", description: "" });
            // utils.board.getById.invalidate({ id: board.id! });
            await utils.tasks.getBoardTasks.invalidate({ boardId: board.id! });
            cancelFn();
        }
    });

    const handleClick = () => {
        if (!task.title || !status.id) return;
        mutate({ ...task, statusId: status.id!, boardId: board.id! });
    };

    const handleCancel = () => {
        setTask({ title: "", description: "" });
        cancelFn();
    };
    return (
        <div className="w-full my-2 p-2 rounded shadow" style={{ backgroundColor: status.color ?? 'transparent', color: getContrastColor(status.color ?? "#fff"), }}>
            <CustomInput placeholder="New Task" label="New Task"
                value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
            <CustomInput placeholder="Description" label="Description"
                value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} />
            <div className="flex">
                <CustomButton className="mt-2 w-full" variant="ghost" onClick={handleClick}>Add Task</CustomButton>
                <CustomButton className="mt-2 w-full" variant="secondary" onClick={handleCancel}>Cancel</CustomButton>
            </div>
        </div>
    )
}