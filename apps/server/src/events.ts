import { database } from '@magickml/database'
import Koa from 'koa'
import { Route } from './types'

export const modules: Record<string, unknown> = {}

const getEvents = async (ctx: Koa.Context) => {
  const event = await database.getEvents(ctx.request.query)
  return (ctx.body = { event })
}

const getAllEvents = async (ctx: Koa.Context) => {
  try {
    const events = await database.getAllEvents()
    return (ctx.body = events)
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}
const deleteEvent = async (ctx: Koa.Context) => {
  try {
    const { id } = ctx.params
    if (!parseInt(id)) {
      ctx.status = 400
      return (ctx.body = 'invalid url parameter')
    }
    const res = await database.deleteEvent(parseInt(id))
    return (ctx.body = true)
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}

const updateEvent = async (ctx: Koa.Context) => {
  try {
    const { id } = ctx.params
    if (!parseInt(id)) {
      ctx.status = 400
      return (ctx.body = 'invalid url parameter')
    }
    const res = await database.updateEvent(id, ctx.request.body)
    return (ctx.body = res)
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}

const createEvent = async (ctx: Koa.Context) => {
  try {
    await database.createEvent(ctx.request.body)
  } catch {
    ctx.status = 500
    return (ctx.body = 'internal error')
  }

  return (ctx.body = 'ok')
}
export const events: Route[] = [
  {
    path: '/event',
    get: getEvents,
    post: createEvent,
  },
  {
    path: '/event/:id',
    delete: deleteEvent,
    put: updateEvent,
  },
  {
    path: '/events',
    get: getAllEvents,
  },
]
