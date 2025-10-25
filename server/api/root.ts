import { z } from 'zod';
import { createCallerFactory, createTRPCRouter, publicProcedure } from './trpc';
import { BoardRouter } from './routers/board';

export const appRouter = createTRPCRouter({
    board: BoardRouter,
    hello: publicProcedure
        .input(
            z.object({
                text: z.string(),
            }),
        )
        .query((opts: any) => {
            return {
                greeting: `hello ${opts.input.text}`,
            };
        }),
});
// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);