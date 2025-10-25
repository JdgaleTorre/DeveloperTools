import { z } from 'zod';
import { createCallerFactory, createTRPCRouter, publicProcedure } from './trpc';
import { BoardRouter } from './routers/board';
import { TasksRouter } from './routers/tasks';

export const appRouter = createTRPCRouter({
    board: BoardRouter,
    tasks: TasksRouter,
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