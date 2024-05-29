// import 'dotenv/config'
// import { z } from 'zod'

// class EnvError extends Error {
//   constructor(message: string) {
//     super(message)
//     this.name = 'EnvError'
//   }
// }

// const val = (envVar: string | undefined, name: string) => {
//   return z
//     .string()
//     .nonempty({ message: `${name} environment variable is missing or empty` })
//     .parse(envVar)
// }

// const validateEnv = (envVar: string | undefined, name: string) => {
//   try {
//     return val(envVar, name)
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       throw new EnvError(`${name} environment variable is missing or empty`)
//     }
//     throw error
//   }
// }

// export const env = {
//   JWT_SECRET: validateEnv(process.env['EMBEDDER_JWT_SECRET'], 'EMBEDDER_JWT_SECRET'),
//   JWT_EXPIRES_IN: validateEnv(
//     process.env['EMBEDDER_JWT_EXPIRES_IN'],
//     'EMBEDDER_JWT_EXPIRES_IN'
//   ),
//   AUTH_ROUTE_MATCHER: validateEnv(
//     process.env['EMBEDDER_AUTH_ROUTE_MATCHER'],
//     'EMBEDDER_AUTH_ROUTE_MATCHER'
//   ),
//   DEV_ENTITY: validateEnv(process.env['NITRO_DEV_ENTITY'], 'NITRO_DEV_ENTITY'),
//   DEV_OWNER: validateEnv(process.env['NITRO_DEV_OWNER'], 'NITRO_DEV_OWNER'),
// }
