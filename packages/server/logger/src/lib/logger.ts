import pino, { type LoggerOptions } from 'pino'
import pretty from 'pino-pretty'
import { config } from 'dotenv-flow'
import { getPinoTransport } from '@hyperdx/node-opentelemetry'

// Load environment variables
config({
  path: '../../../.env.*',
})

const PINO_LOG_LEVEL = process.env['PINO_LOG_LEVEL'] || 'info'
const NODE_ENV = process.env['NODE_ENV'] || 'development'

let logger: pino.Logger | null = null

const createDevelopmentLogger = (opts: LoggerOptions = {}) =>
  pino({
    level: PINO_LOG_LEVEL,
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          level: PINO_LOG_LEVEL,
          translateTime: 'SYS:standard',
          options: {
            colorize: true,
          },
        },
      ],
    },
    ...opts,
  })

const createProductionLogger = () => {
  console.log('PINO_LOG_LEVEL', PINO_LOG_LEVEL)
  const streams = [
    pretty(),
    pino.transport({
      targets: [getPinoTransport(PINO_LOG_LEVEL)],
    }),
  ]

  return pino({ level: PINO_LOG_LEVEL }, pino.multistream(streams))
}

const defaultLoggerOpts: LoggerOptions = {
  name: 'default',
  level: PINO_LOG_LEVEL,
}

export const initLogger = (
  opts: LoggerOptions = defaultLoggerOpts,
  additionalOpts: LoggerOptions = {}
) => {
  if (NODE_ENV === 'development') {
    logger = createDevelopmentLogger({ ...opts, ...additionalOpts })
  } else {
    logger = createProductionLogger()
  }
}

export const getLogger = (additionalOpts: LoggerOptions = {}): pino.Logger => {
  if (logger === null) {
    initLogger(defaultLoggerOpts, additionalOpts)
  }
  return logger as pino.Logger
}
