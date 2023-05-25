import pino from 'pino'
import { LOGGING_ENABLED } from '../config'

let logger: pino.Logger | null = null

const defaultLoggerOpts = {}

export const initLogger = (opts: object = defaultLoggerOpts) => {
  if (LOGGING_ENABLED === true) {
    logger = pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
      ...opts,
      level: 'debug',
    })

    return
  }

  logger = pino(opts)
}

export const getLogger: () => pino.Logger = () => {
  if (logger !== null) {
    return logger
  }

  throw new Error('Logger not initialized. Please call initLogger() first.')
}
