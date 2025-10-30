
import BoardComponent from "@/components/boards/board";
import StatusColumn from "@/components/boards/statusColumn";
import { trpc } from "@/trpc/server";

export default async function BoardPage({ params }: { params: { boardId: string } }) {
    const { boardId } = await params;
    await trpc.board.getById.prefetch({ id: boardId });
    await trpc.tasks.getBoardTasks.prefetch({ boardId });
    return (
        <BoardComponent boardId={boardId} />
    );
}
