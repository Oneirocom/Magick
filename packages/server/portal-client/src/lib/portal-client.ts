import { type AppRouter } from '@magickml/portal-server-router'
import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import superjson from 'superjson'

/**
 * A type-safe vanilla js client for the portal.
 * Use this for server side calls that don't originate from the same host as the portal.
 * If you are on the same host and serverside use 'serverSideCaller'
 * On the client use the regular one to get all the state management goodness.
 */
export const portal = createTRPCProxyClient<AppRouter>({
  /**
   * Transformer used for data de-serialization from the server.
   *
   * @see https://trpc.io/docs/data-transformers
   */
  transformer: superjson,

  /**
   * Links used to determine request flow from client to server.
   *
   * @see https://trpc.io/docs/links
   */
  links: [
    loggerLink({
      enabled: opts =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `http://localhost:4000/api/trpc`,
    }),
  ],
})

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type PortalRouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type PortalRouterOutputs = inferRouterOutputs<AppRouter>
