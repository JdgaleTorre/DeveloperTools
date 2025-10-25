import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { boards, taskStatuses } from "@/app/schema";
import { eq, and, InferInsertModel } from "drizzle-orm";

export const BoardRouter = createTRPCRouter({
    insert: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                description: z.string().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            const [board] = await db.insert(boards).values({
                name: input.name,
                description: input.description,
                ownerId: session.user.id,
            }).returning({ id: boards.id, name: boards.name });

            // Create default statuses for that board
            const defaultStatuses: Array<InferInsertModel<typeof taskStatuses>> = [
                {
                    name: "To Do",
                    boardId: board.id,
                    color: "#3B82F6", // blue-500
                    position: 1,
                },
                {
                    name: "In Progress",
                    boardId: board.id,
                    color: "#F59E0B", // amber-500
                    position: 2,
                },
                {
                    name: "Done",
                    boardId: board.id,
                    color: "#10B981", // emerald-500
                    position: 3,
                },
            ];

            await db.insert(taskStatuses).values(
                defaultStatuses
            );

            return board;
        }),
    getById: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const { db, session } = ctx;
            const board = await db
                .select()
                .from(boards)
                .where(and(eq(boards.id, input.id), eq(boards.ownerId, session.user.id)))
                .limit(1);
            return board[0] ?? null;
        }),
    getUserBoards: protectedProcedure
        .query(async ({ ctx }) => {
            const { db, session } = ctx;
            const userBoards = await db
                .select()
                .from(boards)
                .where(eq(boards.ownerId, session.user.id));
            return userBoards;
        }),
    deleteBoardId:  protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            // First, verify the board belongs to the user
            const board = await db
                .select()
                .from(boards)
                .where(and(eq(boards.id, input.id), eq(boards.ownerId, session.user.id)))
                .limit(1);

            if (board.length === 0) {
                throw new Error("Board not found or you do not have permission to delete it.");
            }

            // Delete the board
            await db.delete(boards).where(eq(boards.id, input.id));

            return { success: true };
        }),

}); 
