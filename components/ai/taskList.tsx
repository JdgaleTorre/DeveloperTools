import { AITaskResponse } from "@/lib/ai"
import { useState } from "react"
import CustomInput from "../ui/input"
import CustomButton from "../ui/button"
import { Check, X } from "lucide-react"
import { Card } from "../ui/card"

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
            <h3>Generated Tasks:</h3>
            {tasks.map((t, i) => (
                <Card key={i} className="p-4 m-2 border-slate-200">
                    <div className="flex items-start gap-3">
                        <CustomInput
                            type="checkbox"
                            checked={t.selected}
                            onChange={() => toggleTask(i)}
                            inputSize={"xs"}
                            className="flex-shrink-1 w-auto"
                        />
                        <div className="flex-1">
                            <h4 className=" mb-1">{t.title}</h4>
                            <p className=" text-sm mb-2">{t.description}</p>

                        </div>
                    </div>
                </Card>
            ))}

            <div className="flex gap-3">
                <CustomButton variant="primary" onClick={() =>
                    onAccept(tasks.filter((t) => t.selected))
                }
                    disabled={tasks.filter((t) => t.selected).length === 0}
                    className="flex-1">
                    <Check />
                    Add {tasks.filter(t => t.selected).length} Tasks to Board
                </CustomButton>
                <CustomButton variant="destructive" onClick={onReject} >
                    <X />
                    Reject
                </CustomButton>
            </div>
        </div >
    )
}
