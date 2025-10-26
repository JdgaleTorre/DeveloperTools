import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { tasks } from "@/app/schema";


export const TasksRouter = createTRPCRouter({
    getBoardTasks: protectedProcedure
        .input(
            z.object({
                boardId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const { db, session } = ctx;
            const boardTasks = await db
                .select()
                .from(tasks)
                .where(eq(tasks.boardId, input.boardId));
            return boardTasks;
        }),
    insert: protectedProcedure
        .input(
            z.object({
                title: z.string(),
                description: z.string().optional(),
                boardId: z.string(),
                statusId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            const [task] = await db.insert(tasks).values({
                title: input.title,
                description: input.description,
                boardId: input.boardId,
                statusId: input.statusId,
            });
            return task;
        }),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            if (!session.user) throw new Error("Not authenticated");
            await db.delete(tasks).where(eq(tasks.id, input.id));
        }),
});