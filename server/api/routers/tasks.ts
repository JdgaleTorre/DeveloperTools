import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq, count } from "drizzle-orm";
import { tasks } from "@/app/schema";
import { conflictUpdateSetAllColumns } from "@/lib/utils";


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
            const [position] = await db.select({ count: count() }).from(tasks).where(eq(tasks.boardId, input.boardId))
            const [task] = await db.insert(tasks).values({
                title: input.title,
                description: input.description,
                boardId: input.boardId,
                statusId: input.statusId,
                position: position.count + 1
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

            await db.delete(tasks).where(eq(tasks.id, input.id));
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string(),
                description: z.string().optional(),
                statusId: z.string(),
                position: z.int()
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            const [task] = await db.update(tasks).set({
                title: input.title,
                description: input.description,
                statusId: input.statusId,
                position: input.position
            }).where(eq(tasks.id, input.id));
            return task;
        }),

    updateMany: protectedProcedure
        .input(
            z.array(
                z.object(
                    {
                        id: z.string(),
                        title: z.string(),
                        description: z.string().optional(),
                        statusId: z.string().optional(),
                        position: z.int(),
                        boardId: z.string(),
                    }
                )
            )
        )
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;

            return db.insert(tasks).values(input).onConflictDoUpdate({
                target: tasks.id,
                set: conflictUpdateSetAllColumns(tasks, ["id"]),
            })
        })
});