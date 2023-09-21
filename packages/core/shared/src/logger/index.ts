import pino from 'pino'
import { getPinoTransport } from '@hyperdx/node-opentelemetry'
import { NODE_ENV, PINO_LOG_LEVEL } from '@magickml/config'

let logger: pino.Logger | null = null

const defaultLoggerOpts = {}

export const initLogger = (opts: object = defaultLoggerOpts) => {
  if (NODE_ENV === 'development') {
    logger = pino({
      transport: {
          targets: [
              {
                  target: 'pino-pretty',
                  level: PINO_LOG_LEVEL,
                  options: {
                      colorize: true,
                  },
              }
          ]
      },
      ...opts,
    })

    return
  }

    logger = pino({
        ...opts,
        transport: {
            targets: [
                getPinoTransport('info')
            ]
        },
        level: 'info',
    })
}

export const getLogger: () => pino.Logger = () => {
  if (logger === null) {
    initLogger()
  }

  return logger as pino.Logger
}
