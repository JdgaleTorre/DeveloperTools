'use client';
import BoardCard from "@/components/boards/boardCard";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const { data } = trpc.board.getUserBoards.useQuery() || [];

    return (

        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <h1 className="text-4xl font-bold text-center sm:text-left">
                Boards
            </h1>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
                {data && data.map((board) => (
                    <BoardCard key={board.id} board={board} />
                ))}

                <Card hover className="cursor-pointer" onClick={() => router.push('/dashboard/boards/create')} >
                    <CardHeader>
                        <CardTitle>Create Board</CardTitle>
                        <CardDescription>Create a new board to manage your tasks.</CardDescription>
                    </CardHeader>
                </Card>

            </div>


        </main>


    );
}