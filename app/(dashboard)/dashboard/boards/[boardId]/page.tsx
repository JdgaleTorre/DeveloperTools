import { trpc } from "@/trpc/server";

export default async function BoardPage({ params }: { params: { boardId: string } }) {
    const { boardId } = await params;
    const board = await trpc.board.getById({ id: boardId });
    return (
        <div className="p-4 w-full max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-left">Board {board.name}</h1>
            <p className="mt-2 text-left">Description: {board.description}</p>
        </div>
    );
}
