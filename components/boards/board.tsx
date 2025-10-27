"use client";
import StatusColumn from "@/components/boards/statusColumn";
import { trpc } from "@/trpc/client";

export default function BoardComponent({ boardId }: { boardId: string }) {
    const { data: board } = trpc.board.getById.useQuery({ id: boardId });
    const { data: tasks } = trpc.tasks.getBoardTasks.useQuery({ boardId });
    return (
        <div className="p-4 w-full max-w-4xl mx-auto h-full">
            <h1 className="text-2xl font-bold text-left">Board {board?.name}</h1>
            <p className="mt-2 text-left">Description: {board?.description}</p>

            <div className="mt-6 w-full flex gap-4 items-start">
                {board?.taskStatuses.map((status) => (
                    <StatusColumn
                        key={status.id}
                        status={status}
                        tasksList={tasks?.filter((task) => task.statusId === status.id).length ? tasks.filter((task) => task.statusId === status.id) : []}
                        statusLength={board.taskStatuses.length}
                    />
                ))}

            </div>
        </div>
    );
}
