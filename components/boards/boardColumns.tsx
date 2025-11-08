import StatusColumn from "@/components/boards/statusColumn";
import CustomButton from "@/components/ui/button";
import { BACKLOGID, BACKLOGNAME, BACKLOGCOLOR } from "@/lib/utils";
import { RouterOutputs } from "@/server/api/root";


type BoardColumnsProp = {
    board: RouterOutputs["board"]["getById"],
    tasks: RouterOutputs["tasks"]["getBoardTasks"],
    rerenderKey: number,
    boardId: string,
    createNewStatus: () => void
}

export function BoardColumns({ board, tasks, rerenderKey, boardId, createNewStatus }: BoardColumnsProp) {

    if (!board) return <></>
    return (
        <>
            {(tasks ?? []).filter((t) => t.statusId === null).length >= 0 && (
                <StatusColumn
                    key={`null-${rerenderKey}`}
                    status={{
                        boardId,
                        name: BACKLOGNAME,
                        id: BACKLOGID,
                        color: BACKLOGCOLOR,
                        position: 0,
                        createdAt: new Date(),
                    }}
                    tasksList={tasks?.filter((t) => t.statusId === null) ?? []}
                    statusLength={board.taskStatuses.length}
                    notShowActionHeaders
                />
            )}

            {board.taskStatuses.map((status) => (
                <StatusColumn
                    key={`${status.id}-${rerenderKey}`}
                    status={status}
                    tasksList={tasks?.filter((t) => t.statusId === status.id) ?? []}
                    statusLength={board.taskStatuses.length}
                />
            ))}

            <div className="min-w-44">
                <CustomButton variant="ghost" onClick={createNewStatus}>
                    + New Status
                </CustomButton>
            </div>
        </>
    );
}
