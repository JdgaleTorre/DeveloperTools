import { useState } from "react";
import { trpc } from "@/trpc/client";


export function useBoardData(boardId: string) {
    const utils = trpc.useUtils();
    const [rerenderKey, setRerenderKey] = useState(0);

    const { data: board } = trpc.board.getById.useQuery({ id: boardId });
    const { data: tasks } = trpc.tasks.getBoardTasks.useQuery({ boardId });

    const { mutate: updateStatuses } = trpc.taskStatuses.updateMany.useMutation({
        onSuccess: async () => utils.tasks.getBoardTasks.invalidate({ boardId }),
    });

    const { mutate: insertManyTasks } = trpc.tasks.insertMany.useMutation({
        onSuccess: async () => utils.tasks.getBoardTasks.invalidate({ boardId }),
    });

    const { mutate: updateTask } = trpc.tasks.updateMany.useMutation({
        onMutate: async (updatedTasks) => {
            await utils.tasks.getBoardTasks.cancel({ boardId });
            const prev = utils.tasks.getBoardTasks.getData({ boardId });

            utils.tasks.getBoardTasks.setData({ boardId }, (old) => {
                if (!old) return updatedTasks.map((u) => ({
                    ...u,
                    createdAt: new Date(),
                    description: u.description ?? null,
                    statusId: u.statusId ?? null
                }));

                const updatedIds = updatedTasks.map((t) => t.id);
                return old.map((t) =>
                    updatedIds.includes(t.id)
                        ? { ...t, ...updatedTasks.find((u) => u.id === t.id)! }
                        : t
                );
            });

            return { prev };
        },
        onError: (_err, _vars, ctx) => {
            if (ctx?.prev) utils.tasks.getBoardTasks.setData({ boardId }, ctx.prev);
        },
        onSettled: async () => utils.tasks.getBoardTasks.invalidate({ boardId }),
    });

    return {
        board,
        tasks,
        updateStatuses,
        updateTask,
        insertManyTasks,
        utils,
        rerenderKey,
        setRerenderKey,
    };
}
