// DOCUMENTED 
// Import the required types from '@magickml/engine' and rename them to avoid naming conflicts.
import {
  Route as MagickRoute,
  Middleware as MagickMiddleware,
  Method as MagickMethod,
  Handler as MagickHandler,
} from "@magickml/engine";

/**
 * Type alias for Middleware imported from '@magickml/engine'.
 */
export type Middleware = MagickMiddleware;

/**
 * Type alias for Method imported from '@magickml/engine'.
 */
export type Method = MagickMethod;

/**
 * Type alias for Handler imported from '@magickml/engine'.
 */
export type Handler = MagickHandler;

/**
 * Type alias for Route imported from '@magickml/engine'.
 */
export type Route = MagickRoute;
