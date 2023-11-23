import pino from 'pino'
import { NODE_ENV, PINO_LOG_LEVEL } from 'shared/config'

let logger: pino.Logger | null = null

const defaultLoggerOpts = {}

export const initLogger = (opts: object = defaultLoggerOpts) => {
  if (NODE_ENV === 'development') {
    logger = pino({
      level: PINO_LOG_LEVEL,
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            level: PINO_LOG_LEVEL,
            options: {
              colorize: true,
            },
          },
        ],
      },
      ...opts,
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
