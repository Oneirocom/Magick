// DOCUMENTED 
/**
 * @description Middleware function to catch and log errors
 * @param context - Feathers HookContext object
 * @param next - Function to call the next middleware function
 * @returns Promise<void>
 */
import type { HookContext, NextFunction } from '../declarations'
import { logger } from '../utils/logger'

export const logError = async (context: HookContext, next: NextFunction): Promise<void> => {
  try {
    await next()
  } catch (error: any) {
    // Send stack trace to logger
    logger.error(error.stack)

    // Log validation errors, if any
    if (error.data) {
      logger.error('Data: %O', error.data)
    }

    // Re-throw error to be handled by error handler
    throw error
  }
}