import pino from 'pino'
import { config } from 'dotenv-flow'

// Load environment variables
config({
  path: '../../../.env.*',
})

const PINO_LOG_LEVEL = process.env['PINO_LOG_LEVEL'] || 'info'
const NODE_ENV = process.env['NODE_ENV'] || 'development'

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
