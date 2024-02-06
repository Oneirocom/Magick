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

const createDevelopmentLogger = opts =>
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
    ...opts,
  })

const createProductionLogger = (
  opts: object = {},
  transportOpts: object = {}
) => {
  const targets = [
    getPinoTransport(PINO_LOG_LEVEL),
    // you can add other transports here if needed
  ]

  return pino({
    ...opts, // Spread the general options into the pino configuration
    transport: pino.transport({
      targets,
      ...transportOpts, // Spread the transport options into the pino.transport configuration
    }),
  })
}

const defaultLoggerOpts = {
  name: 'default',
  level: PINO_LOG_LEVEL,
}

export const initLogger = (opts: object = defaultLoggerOpts) => {
  if (NODE_ENV === 'development') {
    logger = createDevelopmentLogger(opts)
  } else {
    logger = createProductionLogger(opts)
  }
}

export const getLogger: () => pino.Logger = () => {
  if (logger === null) {
    initLogger()
  }

  return logger as pino.Logger
}
