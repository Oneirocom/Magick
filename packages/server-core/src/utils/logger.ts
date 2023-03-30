// GENERATED 
/**
 * This module exports a instantiated winston logger, configured
 * for console output.
 *
 * @remarks
 * For more information see the WinstonJS documentation:
 * https://github.com/winstonjs/winston
 *
 * @packageDocumentation
 */

import { createLogger, format, transports } from 'winston';

/**
 * The logger instance to be exported.
 */
export const logger = createLogger({
  /**
   * The minimum level of logs to output.
   */
  level: 'info',
  /**
   * The formats to apply to the log message.
   */
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  /**
   * The output transport to use for logging, in this case the console.
   */
  transports: [new transports.Console()],
});