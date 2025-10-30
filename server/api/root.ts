import { z } from 'zod';
import { createCallerFactory, createTRPCRouter, publicProcedure } from './trpc';
import { BoardRouter } from './routers/board';
import { TasksRouter } from './routers/tasks';
import { taskStatuses } from '@/app/schema';
import { taskStatusesRouter } from './routers/taskStatuses';

export const appRouter = createTRPCRouter({
    board: BoardRouter,
    tasks: TasksRouter,
    taskStatuses: taskStatusesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);