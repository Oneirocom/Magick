// DOCUMENTED
// Import the required types from '@magickml/core' and rename them to avoid naming conflicts.
import {
  Route as MagickRoute,
  Middleware as MagickMiddleware,
  Method as MagickMethod,
  Handler as MagickHandler,
} from 'shared/core'

/**
 * Type alias for Middleware imported from '@magickml/core'.
 */
export type Middleware = MagickMiddleware

/**
 * Type alias for Method imported from '@magickml/core'.
 */
export type Method = MagickMethod

/**
 * Type alias for Handler imported from '@magickml/core'.
 */
export type Handler = MagickHandler

/**
 * Type alias for Route imported from '@magickml/core'.
 */
export type Route = MagickRoute
