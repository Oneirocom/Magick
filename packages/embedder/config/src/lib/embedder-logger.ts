import { createConsola } from 'consola'

export const logger = createConsola()

export const err = (...args: any[]) => {
  logger.error(args.join(' '))
}

export const info = (...args: any[]) => {
  logger.info(args.join(' '))
}

export const warn = (...args: any[]) => {
  logger.warn(args.join(' '))
}

export const success = (...args: any[]) => {
  logger.success(args.join(' '))
}
