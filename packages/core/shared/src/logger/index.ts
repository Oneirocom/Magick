import pino from 'pino'
import { NODE_ENV, PINO_LOG_LEVEL } from '@magickml/config'

let logger: pino.Logger | null = null

const defaultLoggerOpts = {}

export const initLogger = (opts: object = defaultLoggerOpts) => {
  if (NODE_ENV === 'development') {
    logger = pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
      ...opts,
      level: PINO_LOG_LEVEL,
    })

    return
  }

  logger = pino(opts)
}

export const getLogger: () => pino.Logger = () => {
  if (logger === null) {
    initLogger()
  }

  return logger as pino.Logger
}
