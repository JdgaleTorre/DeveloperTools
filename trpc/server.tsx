import 'server-only'; // <-- ensure this file cannot be imported from the client
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';

import { makeQueryClient } from './query-client';

import { createTRPCContext } from '@/server/api/trpc';
import { appRouter, createCaller } from '@/server/api/root';
import { headers } from 'next/headers';
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

export const getQueryClient = cache(makeQueryClient);
const caller = createCaller(createContext);
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient,
);