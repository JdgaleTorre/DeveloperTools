'use client';
import { useRouter } from "next/navigation";
import CustomButton from "../ui/button";
import { trpc } from "@/trpc/client";
import { InferSelectModel } from "drizzle-orm";
import { boards } from "@/app/schema";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function BoardCard({ board }: { board: InferSelectModel<typeof boards> }) {
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
        <Card className="cursor-pointer" onClick={() => router.push(`/dashboard/boards/${board.id}`)} hover>
            <CardHeader>
                <CardTitle>
                    {board.name}
                </CardTitle>
                <CardDescription>
                    {board.description}
                </CardDescription>
            </CardHeader>
            <CardBody>
                <CustomButton className="z-50" variant="destructive" onClick={(e) => {
                    e.stopPropagation();
                    mutate({ id: board.id });
                }}>
                    Delete Board
                </CustomButton>
            </CardBody>
        </Card>

    );
}