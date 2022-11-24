import axios from 'axios'
import Koa from 'koa'

import { IAuth, noAuth } from '../../middleware/auth'
import { Route } from '../../types'
import { CustomError } from '../../utils/CustomError'

import { auth as authentication } from '../../middleware/auth'
import { database } from '../../database'
import { makeResponse } from '../../utils/utils'

export const auth: Route[] = [
  {
    path: '/auth/login.json',
    access: noAuth,
    post: async (ctx: Koa.Context) => {
      const response = await axios({
        method: 'post',
        url: process.env.API_URL + '/auth/login.json',
        headers: {
          'Content-Type': 'application/json',
        },
        data: ctx.request.body,
      })
      // eslint-disable-next-line no-console
      console.log('response data is: ', response.data)

      if (response.data.accessToken === null)
        throw new CustomError('authentication-error', response.data)

      ctx.body = response.data
    },
  },
  {
    path: '/auth/login',
    access: noAuth,
    get: async (ctx: Koa.Context) => {
      const { user_id } = ctx.request.query

      const { data, success } = await database.instance.getAuthuser(
        user_id as string
      )

      if (success) return (ctx.body = makeResponse('Token available', data))

      return (
        (ctx.body = makeResponse('token expired or not found', {})),
        (ctx.status = 400)
      )
    },
    post: async (ctx: Koa.Context) => {
      const { user_id } = ctx.request.body

      // generate token for new user
      const token: any = (authentication as IAuth).generate(user_id)

      const { success, data, isAlreadyExists } =
        await database.instance.addAuthUser({
          token: token,
          user_id: user_id,
        })

      if (isAlreadyExists)
        return (
          (ctx.body = makeResponse('Token already exists!', data)),
          (ctx.status = 400)
        )
      if (success)
        return (ctx.body = makeResponse('Token added successfully', data))

      return (
        (ctx.body = makeResponse(
          'Some fields are missing, send valid body!',
          {}
        )),
        (ctx.status = 400)
      )
    },
  },
]
