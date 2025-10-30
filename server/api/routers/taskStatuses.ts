import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { taskStatuses } from "@/app/schema";
import { eq } from "drizzle-orm";
import { conflictUpdateSetAllColumns } from "@/lib/utils"

export const taskStatusesRouter = createTRPCRouter({
    getBoardStatuses: protectedProcedure
        .input(z.object({
            boardId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const { db, session } = ctx;

            const statuses = await db
                .select()
                .from(taskStatuses)
                .where(
                    eq(taskStatuses.boardId, input.boardId),
                )

            return statuses;
        }),
    insert: protectedProcedure
        .input(
            z.object({
                boardId: z.string(),
                name: z.string(),
                color: z.string().max(20),
                position: z.int()
            })
        )
        .mutation(({ ctx, input }) => {
            const { db, session } = ctx;

            return db.insert(taskStatuses).values(
                {
                    name: input.name,
                    boardId: input.boardId,
                    color: input.color,
                    position: input.position
                }
            ).returning()

        }),

    update: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                color: z.string().max(20),
                position: z.int()
            })
        )
        .mutation(({ ctx, input }) => {
            const { db, session } = ctx;

            return db.update(taskStatuses).set(
                {
                    name: input.name,
                    color: input.color,
                    position: input.position
                }
            ).returning()
        }),
    updateMany: protectedProcedure
        .input(z.array(
            z.object({
                id: z.string(),
                boardId: z.string(),
                name: z.string(),
                color: z.string().max(20),
                position: z.int()
            })

        ))
        .mutation(({ ctx, input }) => {
            const { db, session } = ctx;

            return db.insert(taskStatuses).values(input).onConflictDoUpdate({
                target: taskStatuses.id,
                set: conflictUpdateSetAllColumns(taskStatuses, ["id"]),
            })

        })
})