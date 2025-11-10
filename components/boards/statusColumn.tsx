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
import { EllipsisVertical, Move } from "lucide-react";
import CustomInput from "../ui/input";
import { trpc } from "@/trpc/client";
import { ContextMenu, ContextMenuItem } from "../ui/context_menu";
import { useToast } from "../ui/toast";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "../ui/card";

interface StatusColumnProps {
    status: InferSelectModel<typeof taskStatuses>,
    tasksList: InferSelectModel<typeof tasks>[],
    statusLength: number,
    isOverlay?: boolean,
    notShowActionHeaders?: boolean,
}


export default function StatusColumn({ status, tasksList, statusLength, isOverlay, notShowActionHeaders = false }: StatusColumnProps) {
    const { addToast } = useToast();
    const [insertState, setInsertState] = useState(false);
    const utils = trpc.useUtils();
    const [newStatus, setNewStatus] = useState("");
    const { mutate: insertStatus } = trpc.taskStatuses.insert.useMutation({
        onSuccess: async () => {
            utils.board.getById.invalidate();
        }
    });

    const { mutate: deleteStatus } = trpc.taskStatuses.delete.useMutation({
        onSuccess: async () => {
            addToast({ title: "Status Deleted", variant: "success" });
            utils.board.getById.invalidate();
        }
    })


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

    function createStatus() {
        insertStatus({ ...status, name: newStatus, color: status.color ?? '' })

    }

    if (status.id === "") {
        return (
            <div key={status.id}
                style={style}
                ref={setNodeRef}
                className={`w-72 border border-gray-300 rounded-lg p-4 flex-shrink-0 h-auto bg-background dark:bg-background-dark z-0 ${variants({
                    dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
                })}`}
            >
                <div className="flex justify-between cursor-pointer">
                    {/* <h2 className="text-lg font-semibold flex-grow ">{status.name}</h2> */}
                    <CustomInput autoFocus placeholder="New Status" variant="default" onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            createStatus()
                        }
                    }}
                        value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                    />

                </div>
            </div>
        )
    }
    const menuItems = [
        {
            label: "Delete",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
            ),
            onClick: () => {
                deleteStatus({ id: status.id })
            },
        },
        { divider: true }
    ]

    //{ width: `${100 / statusLength}%`, ...style }
    return (
        <Card key={status.id}
            style={style}
            ref={setNodeRef}
            className={`min-w-96 mb-2 flex-1 bg-muted rounded-lg p-3 space-y-3 max-h-[650px] transition-colors ${variants({
                dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
            })}`}>
            <CardHeader className="flex flex-row  justify-between p-2">
                <div className="flex grow items-center cursor-grab"
                    {...attributes}
                    {...listeners}>
                    <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: status.color ?? '#FFFFFF' }}
                    />
                    <CardTitle className="flex-1">{status.name}</CardTitle>
                    <Move className={`${notShowActionHeaders ? 'hidden' : 'visible'}`} />
                </div>
                {!notShowActionHeaders && (
                    <ContextMenu items={menuItems as ContextMenuItem[]}>
                        <CustomButton><EllipsisVertical /></CustomButton>
                    </ContextMenu>
                )}
            </CardHeader>
            <CardBody className="p-2 max-h-[500px] overflow-y-auto scrollbar-thin 
            scrollbar-thumb-gray-500 scrollbar-track-muted hover:scrollbar-thumb-accent rounded-xl">
                <SortableContext items={tasksList.map((task) => task.id)}>
                    {tasksList.map((task) => (
                        <TaskCard key={task.id} status={status} task={task} />
                    ))}
                </SortableContext>
            </CardBody>
            <CardFooter className="mb-0 pb-0">
                {insertState ? (
                    <NewTaskCard status={status} board={{ id: status.boardId } as InferSelectModel<typeof boards>} cancelFn={() => setInsertState(false)} />
                ) : (
                    <CustomButton className="w-full relative z-30 mt-2" variant="ghost" size="sm" onClick={(e) => {
                        e.preventDefault()
                        setInsertState(true)
                    }}>+ Add New Task</CustomButton>
                )}
            </CardFooter>
        </Card>

    )
}

