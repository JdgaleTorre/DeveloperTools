'use client';
import { useRouter } from "next/navigation";
import CustomButton from "../ui/button";
import { trpc } from "@/trpc/client";
import { InferInsertModel } from "drizzle-orm";
import { boards } from "@/app/schema";

export default function BoardCard({ board }: { board: InferInsertModel<typeof boards> }) {
    const router = useRouter();
    const utils = trpc.useUtils();
    const { data } = trpc.board.getUserBoards.useQuery() || [];
    const { mutate } = trpc.board.deleteBoardId.useMutation({
        onSuccess: () => {
            // Invalidate and refetch
            utils.board.getUserBoards.invalidate();
        }
    });

    return (
        <div className="m4 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            onClick={() => router.push(`/dashboard/boards/${board.id}`)}>
            <h2 className="text-2xl font-semibold">{board.name}</h2>
            <p className="mb-4">{board.description}</p>
            <CustomButton className="z-50" variant="destructive" onClick={(e) => {
                e.stopPropagation();
                mutate({ id: board.id! });
            }}>
                Delete Board
            </CustomButton>
        </div >
    );
}