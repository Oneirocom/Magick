import { err } from '@magickml/embedder-config'
import { createError } from 'h3'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

export const TokenPayloadSchema = z.object({
  owner: z.string(),
  entity: z.string(),
  noExpiresAt: z.boolean().optional(),
})

export type TokenPayload = z.infer<typeof TokenPayloadSchema>

export function generateToken(payload: TokenPayload) {
  try {
    const val = TokenPayloadSchema.parse(payload)
    const { noExpiresAt } = val

    const secret = process.env['EMBEDDER_JWT_SECRET']
    const exp = process.env['EMBEDDER_JWT_EXPIRES_IN']

    if (!secret) {
      console.error('EMBEDDER_JWT_SECRET not set')
      throw createError({
        statusCode: 500,
        statusMessage: 'EMBEDDER_JWT_SECRET not set',
      })
    }

    if (!noExpiresAt) {
      if (!exp) {
        console.error('EMBEDDER_JWT_EXPIRES_IN not set')
        throw createError({
          statusCode: 500,
          statusMessage: 'EMBEDDER_JWT_EXPIRES_IN not set',
        })
      }
    }

    // Include standard claims
    const token = jwt.sign(val, secret, {
      algorithm: 'HS256',
      ...(noExpiresAt ? {} : { expiresIn: exp }),
      // put these in envs?
      // issuer: "your-app",
      // audience: "your-audience",
    })

    return token
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Internal Server Error, ${error}`,
    })
  }
}

export function validateToken(token: string) {
  const secret = process.env['EMBEDDER_JWT_SECRET']
  if (!secret) {
    throw err('EMBEDDER_JWT_SECRET not set')
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      // issuer: "your-app",
      // audience: "your-audience",
    })
    return decoded
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Failed to validate token:', error)

    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
}
