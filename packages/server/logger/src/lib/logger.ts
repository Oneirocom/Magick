import pino from 'pino'
import { config } from 'dotenv-flow'
import { getPinoTransport } from '@hyperdx/node-opentelemetry'

// Load environment variables
config({
  path: '../../../.env.*',
})

const PINO_LOG_LEVEL = process.env['PINO_LOG_LEVEL'] || 'info'
const NODE_ENV = process.env['NODE_ENV'] || 'development'

let logger: pino.Logger | null = null

const createDevelopmentLogger = () =>
  pino({
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
  })

const createProductionLogger = () => {
  const targets = [
    getPinoTransport(PINO_LOG_LEVEL),
    // you can add other transports here if needed
  ]

  return pino(
    pino.transport({
      targets,
    })
  )
}

export const initLogger = () => {
  if (NODE_ENV === 'development') {
    logger = createDevelopmentLogger()
  } else {
    logger = createProductionLogger()
  }
}

export const getLogger: () => pino.Logger = () => {
  if (logger === null) {
    initLogger()
  }

  return logger as pino.Logger
}
