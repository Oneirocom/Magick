// DOCUMENTED
// Import the required types from 'shared/core' and rename them to avoid naming conflicts.
import {
  Route as MagickRoute,
  Middleware as MagickMiddleware,
  Method as MagickMethod,
  Handler as MagickHandler,
} from 'shared/core'

/**
 * Type alias for Middleware imported from 'shared/core'.
 */
export type Middleware = MagickMiddleware

/**
 * Type alias for Method imported from 'shared/core'.
 */
export type Method = MagickMethod

/**
 * Type alias for Handler imported from 'shared/core'.
 */
export type Handler = MagickHandler

/**
 * Type alias for Route imported from 'shared/core'.
 */
export type Route = MagickRoute
