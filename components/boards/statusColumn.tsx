'use client'
import { InferInsertModel } from "drizzle-orm";
import TaskCard from "../task/taskCard";
import { boards, tasks, taskStatuses } from "@/app/schema";
import { useState } from "react";
import NewTaskCard from "../task/newTaskCard";

export default function StatusColumn({ status, tasksList, statusLength }: { status: InferInsertModel<typeof taskStatuses>, tasksList: InferInsertModel<typeof tasks>[], statusLength: number }) {
    const [insertState, setInsertState] = useState(false);
    return (
        <div key={status.id} className={`border border-gray-300 rounded-lg p-4 w-1/${statusLength} flex-shrink-0`}>
            <h2 className="text-lg font-semibold">{status.name}</h2>
            {tasksList.map((task) => (
                <TaskCard key={task.id} status={status} task={task} />
            ))}
            {insertState ? (
                <NewTaskCard status={status} board={{ id: status.boardId } as InferInsertModel<typeof boards>} cancelFn={() => setInsertState(false)} />
            ) : (
                <button onClick={() => setInsertState(true)} className="mt-2 text-blue-500">
                    + Add New Task
                </button>
            )}
        </div>
    )
}
