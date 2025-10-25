import { z } from 'zod';
import { createCallerFactory, createTRPCRouter, publicProcedure } from './trpc';

export const appRouter = createTRPCRouter({
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