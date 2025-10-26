"use client";
import { getContrastColor } from "@/lib/utils";
import { InferInsertModel } from "drizzle-orm";
import { tasks, taskStatuses } from "@/app/schema";
import CustomButton from "../ui/button";



export default function TaskCard({ status, task }: { status: InferInsertModel<typeof taskStatuses>, task: InferInsertModel<typeof tasks> }) {

    return (
        <div className="my-2 p-2 rounded shadow flex flex-row items-center" style={{ backgroundColor: status.color ?? 'transparent', color: getContrastColor(status.color ?? "#fff"), }}>
            <div className="flex-grow">
                <p className="text-md mb-2">{task.title}</p>
                <p className="text-sm">{task.description}</p>
            </div>
            <CustomButton variant="ghost" size="sm" onClick={() => { }}>E</CustomButton>
            <CustomButton variant="ghost-destructive" size="sm" onClick={() => { }}>X</CustomButton>

        </div>
    )
}