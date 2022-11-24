import { Context } from 'koa'

export const respond = (ctx: Context, status: number, msg: string) => {
  ctx.status = status
  ctx.body = msg
}
