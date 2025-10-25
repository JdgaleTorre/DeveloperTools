import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { boards } from "@/app/schema";

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
            return db.insert(boards).values({
                name: input.name,
                description: input.description,
                ownerId: session.user.id,
            }).returning({ id: boards.id, name: boards.name });
        }),

},
);
