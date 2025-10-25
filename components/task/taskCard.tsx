"use client";
import { getContrastColor } from "@/lib/utils";
import { InferInsertModel } from "drizzle-orm";
import { tasks, taskStatuses } from "@/app/schema";



export default function TaskCard({ status, task }: { status: InferInsertModel<typeof taskStatuses>, task: InferInsertModel<typeof tasks> }) {

    return (
        <div className="my-2 p-2 rounded shadow" style={{ backgroundColor: status.color ?? 'transparent', color: getContrastColor(status.color ?? "#fff"), }}>
            <p className="text-md">{task.title}</p>
            <p className="text-sm">{task.description}</p>
        </div>
    )
}