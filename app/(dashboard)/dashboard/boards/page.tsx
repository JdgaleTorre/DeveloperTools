'use client';
import CustomButton from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";

export default function Dashboard() {

    const { addToast } = useToast();
    const utils = trpc.useUtils();
    const { data } = trpc.board.getUserBoards.useQuery() || [];
    const { mutate } = trpc.board.deleteBoardId.useMutation({
        onSuccess: () => {
            // Invalidate and refetch
            utils.board.getUserBoards.invalidate();
            addToast({
                title: "Success",
                description: "Board deleted successfully",
                variant: "success",
            });

        }
    });

    const router = useRouter();

    return (

        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <h1 className="text-4xl font-bold text-center sm:text-left">
                Boards
            </h1>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
                {data && data.map((board) => (
                    <div key={board.id} className="m4 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                        onClick={() => router.push(`/dashboard/boards/${board.id}`)}>
                        <h2 className="text-2xl font-semibold">{board.name}</h2>
                        <p className="mb-4">{board.description}</p>
                        <CustomButton className="z-50" variant="destructive" onClick={(e) => {
                            e.stopPropagation();
                            mutate({ id: board.id });
                        }}>
                            Delete Board
                        </CustomButton>
                    </div>
                ))}

                <div className="m4 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                    onClick={() => router.push('/dashboard/boards/create')}>
                    <h2 className="text-2xl font-semibold">Create Board</h2>
                    <p className="mb-4">Create a new board to manage your tasks.</p>
                </div>

            </div>


        </main>


    );
}