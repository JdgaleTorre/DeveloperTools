import StatusColumn from "@/components/boards/statusColumn";
import NewTaskCard from "@/components/task/newTaskCard";
import TaskCard from "@/components/task/taskCard";
import { trpc } from "@/trpc/server";

export default async function BoardPage({ params }: { params: { boardId: string } }) {
    const { boardId } = await params;
    const board = await trpc.board.getById({ id: boardId });
    const tasks = await trpc.tasks.getBoardTasks({ boardId });
    return (
        <div className="p-4 w-full max-w-4xl mx-auto h-full">
            <h1 className="text-2xl font-bold text-left">Board {board?.name}</h1>
            <p className="mt-2 text-left">Description: {board?.description}</p>

            <div className="mt-6 flex gap-4">
                {board?.taskStatuses.map((status) => (
                    <StatusColumn
                        key={status.id}
                        status={{ ...status, boardId: board.id, name: status.name ?? "", color: status.color ?? "", id: status.id ?? "", position: status.position ?? 0 }}
                        tasksList={tasks.filter((task) => task.statusId === status.id)}
                        statusLength={board.taskStatuses.length}
                    />
                ))}

            </div>
        </div>
    );
}
