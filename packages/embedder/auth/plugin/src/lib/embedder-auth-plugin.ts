import jwt from 'jsonwebtoken'
import { createError, getHeader, type H3Event } from 'h3'
import { z } from 'zod'
import { defineNitroPlugin } from 'nitropack/runtime'
import { err, warn } from '@magickml/embedder/config'

const secret = process.env['NITRO_JWT_SECRET']
const exp = process.env['NITRO_JWT_EXPIRES_IN']
const authRouteMatcher = process.env['NITRO_AUTH_ROUTE_MATCHER']

if (!secret || !exp || !authRouteMatcher) {
  throw err(
    'NITRO_JWT_SECRET or NITRO_JWT_EXPIRES_IN or NITRO_AUTH_ROUTE_MATCHER not set'
  )
}

// Utility function to verify token
export function verifyToken(token: string, secret: string) {
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
}

// Middleware function
export const authMiddleware = (event: H3Event) => {
  console.log('Authenticating request...')
  const token = getHeader(event, 'authorization')?.split(' ')[1]

  if (!token) {
    warn('No token provided')
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const payload = verifyToken(token, secret)

  if (typeof payload === 'string') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Token is invalid',
    })
  }

  event.context['auth'] = { ...payload }
}

export const embedderAuthPlugin = defineNitroPlugin(nitroApp => {
  const defaultMatcher = (url: string) => true

  const tokenMatcher = (url: string) => url === '/api/token'

  const configMatcher = authRouteMatcher ? new RegExp(authRouteMatcher) : null

  const matcher = configMatcher
    ? (url: string) => configMatcher.test(url)
    : defaultMatcher

  nitroApp.hooks.hook('request', event => {
    const path = z.string().safeParse(event.node.req.url)

    if (!path.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
      })
    }

    if (event.node.req.method !== 'OPTIONS' && matcher(path.data)) {
      if (tokenMatcher(path.data)) {
        return
      }
      try {
        authMiddleware(event)
      } catch (error: any) {
        event.node.res.statusCode = 500
        event.node.res.statusMessage = 'Internal Server Error'
        event.node.res.end()
        return
      }
    }
  })
})
