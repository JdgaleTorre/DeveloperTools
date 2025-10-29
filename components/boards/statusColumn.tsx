'use client'
import { InferSelectModel } from "drizzle-orm";
import TaskCard from "../task/taskCard";
import { boards, tasks, taskStatuses } from "@/app/schema";
import { useState } from "react";
import NewTaskCard from "../task/newTaskCard";
import CustomButton from "../ui/button";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { DraggableData } from "@/lib/utils";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority"
import { Move } from "lucide-react";

interface StatusColumnProps {
    status: InferSelectModel<typeof taskStatuses>,
    tasksList: InferSelectModel<typeof tasks>[],
    statusLength: number,
    isOverlay?: boolean
}


export default function StatusColumn({ status, tasksList, statusLength, isOverlay }: StatusColumnProps) {
    const [insertState, setInsertState] = useState(false);
    const { setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging, } = useSortable({
            id: status.id,
            data: {
                type: "Status",
                status,
                task: null
            } satisfies DraggableData,
            attributes: {
                roleDescription: `Column: ${status.name}`,
            },
        });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const variants = cva(
        "", {
        variants: {
            dragging: {
                default: "border-2 border-transparent",
                over: "ring-2 opacity-30",
                overlay: "ring-2 ring-primary",
            },
        },
    }
    );

    //{ width: `${100 / statusLength}%`, ...style }
    return (
        <div key={status.id}
            style={style}
            ref={setNodeRef}
            className={`min-w-72 border border-gray-300 rounded-lg p-4 flex-shrink-0 h-auto bg-background dark:bg-background-dark z-0 ${variants({
                dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
            })}`}
        >
            <div className="flex justify-between cursor-pointer"
                {...attributes}
                {...listeners}
            >
                <h2 className="text-lg font-semibold flex-grow ">{status.name}</h2>
                <Move />
            </div>
            <SortableContext items={tasksList.map((task) => task.id)}>
                {tasksList.map((task) => (
                    <TaskCard key={task.id} status={status} task={task} />
                ))}
            </SortableContext>
            {insertState ? (
                <NewTaskCard status={status} board={{ id: status.boardId } as InferSelectModel<typeof boards>} cancelFn={() => setInsertState(false)} />
            ) : (
                <CustomButton className="w-full relative z-50" variant="ghost" size="sm" onClick={(e) => {
                    console.log('Here')
                    e.preventDefault()
                    setInsertState(true)
                }}>+ Add New Task</CustomButton>
            )}
        </div>
    )
}


