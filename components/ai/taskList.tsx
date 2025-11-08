import { AITaskResponse } from "@/lib/ai"
import { useState } from "react"
import CustomInput from "../ui/input"
import CustomButton from "../ui/button"
import { Check, X } from "lucide-react"

type Task = {
    title: string
    description?: string
}
type TaskListProps = {
    data: AITaskResponse
    onAccept: (selectedTasks: Task[]) => void
    onReject: () => void
}

export function TaskList({ data, onAccept, onReject }: TaskListProps) {
    const [tasks, setTasks] = useState(
        data.tasks.map((t) => ({ ...t, selected: false }))
    )

    const toggleTask = (index: number) => {
        setTasks((prev) =>
            prev.map((task, i) =>
                i === index ? { ...task, selected: !task.selected } : task
            )
        )
    }

    return (
        <div>
            <ul className="list-disc pl-5 space-y-2 mb-4">
                {tasks.map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                        <CustomInput
                            type="checkbox"
                            checked={t.selected}
                            onChange={() => toggleTask(i)}
                            inputSize={"xs"}
                            className="flex-shrink-1 w-auto"
                        />
                        <div className="flex-grow">
                            <p className="font-medium">{t.title}</p>
                            {t.description && (
                                <p className="text-sm text-muted-foreground">{t.description}</p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex gap-3">
                <CustomButton variant="primary" onClick={() =>
                    onAccept(tasks.filter((t) => t.selected))
                }
                    disabled={tasks.filter((t) => t.selected).length === 0}
                    className="flex-1">
                    <Check />
                    Accept
                </CustomButton>
                <CustomButton variant="destructive" onClick={onReject} className="flex-1">
                    <X />
                    Reject
                </CustomButton>
            </div>
        </div >
    )
}
