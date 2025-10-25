import NewTaskCard from "@/components/task/newTaskCard";
import CustomButton from "@/components/ui/button";
import CustomInput from "@/components/ui/input";
import { getContrastColor } from "@/lib/utils";
import { trpc } from "@/trpc/server";

export default async function BoardPage({ params }: { params: { boardId: string } }) {
    const { boardId } = await params;
    const board = await trpc.board.getById({ id: boardId });
    return (
        <div className="p-4 w-full max-w-4xl mx-auto h-full">
            <h1 className="text-2xl font-bold text-left">Board {board?.name}</h1>
            <p className="mt-2 text-left">Description: {board?.description}</p>

            <div className="mt-6 flex gap-4">
                {board?.taskStatuses.map((status) => (
                    <div key={status.id} className={`border border-gray-300 rounded-lg p-4 w-1/${board.taskStatuses.length} flex-shrink-0`}
                    >
                        <h2 className="text-xl font-semibold mb-2">{status.name}</h2>
                        <div className="flex flex-col gap-2">
                            <div className="p-2 rounded shadow" style={{ backgroundColor: status.color ?? 'transparent', color: getContrastColor(status.color ?? "#fff"), }}>
                                <p className="text-md">Task 1</p>
                                <p className="text-sm">Description for Task 1</p>
                            </div>
                            <div className="p-2 rounded shadow" style={{ backgroundColor: status.color ?? 'transparent', color: getContrastColor(status.color ?? "#fff"), }}>
                                <p className="text-md">Task 2</p>
                                <p className="text-sm">Description for Task 2</p>
                            </div>

                            <NewTaskCard
                                status={{
                                    ...status,
                                    name: status.name ?? "",
                                    id: status.id ?? undefined,
                                    position: status.position ?? undefined,
                                }}
                                board={{
                                    ...board,
                                    name: board.name ?? "",
                                    description: board.description ?? "",
                                    id: board.id ?? undefined,
                                    ownerId: board.ownerId ?? undefined,
                                }}
                            />
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}
