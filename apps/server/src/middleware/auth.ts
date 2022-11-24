import Koa from 'koa'
import jwt, { SignOptions } from 'jsonwebtoken'
import { isAuthentication, isValidEndPoint, makeResponse } from '../utils/utils'

// TODO: Handle these

export const noAuth = async (ctx: Koa.Context, next: Koa.Next) => {
  await next()
}

export const apiKeyAuth = () => {
  return noAuth
}

export const apiKeyWithAccess = (v: any) => {
  return noAuth
}

function Auth() {
  // TODO: you can add url here to skip authentication
  let unProtectedUrls: string[] = [
    '/auth/login?*',
    '/auth/login',
    '/auth/login.json',
  ]

  this.generate = function (data: string | object, options?: SignOptions) {
    try {
      const val = jwt.sign(
        data,
        process.env.AUTHENTICATION_SECRET_KEY as string,
        options
      )
      return val
    } catch (error) {
      console.log('Auth => generate => ', error)
      return null
    }
  }

  this.verify = function (token: string) {
    try {
      const val = jwt.verify(
        token,
        process.env.AUTHENTICATION_SECRET_KEY as string
      )
      return val
    } catch (error) {
      console.log('Auth => verify => ', error)
      return null
    }
  }

  this.isValidToken = (ctx: Koa.Context, next: Koa.Next) => {
    try {
      if (!isAuthentication) return next()

      // skip url logic
      const isSkip = isValidEndPoint(unProtectedUrls, ctx.url)

      if (isSkip) return next()

      const token = ctx.request.header.authorization

      if (token) {
        const decoded = this.verify(token)
        if (decoded) {
          return next()
        }
      }
      throw new Error('Invalid token')
    } catch (error) {
      console.log('Auth => isValidToken => ', error)
      return (ctx.body = makeResponse('Invalid token', {})), (ctx.status = 401)
    }
  }
}

export interface IAuth {
  generate: (data: string | object, options?: SignOptions) => string | null
  verify: (token: string) => string | null
  isValidToken: (ctx: Koa.Context, next: Koa.Next) => void
}

export const auth: IAuth = new (Auth as any)()
