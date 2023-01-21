import { database } from '@magickml/database'
import Koa from 'koa'
import { Route } from './types'
import { weaviate_connection } from '@magickml/systems'
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

const createEventWeaviate = async (ctx: Koa.Context) => {
  try {
    await weaviate_connection.createEvent(ctx.request.body)
    ctx.status = 200
    return (ctx.body = "ok")
  } catch(e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}

const getEventsWeaviate = async (ctx: Koa.Context) => {
  try{
    console.log("Inside in TRY")
    console.log(ctx.request.body)
    const events = await weaviate_connection.getEvents(ctx.request.query)
    return (ctx.body = { events })
  } catch (e) {
    console.log(e)
    ctx.status = 200
    return (ctx.body = "Error")
  }
  
}

const getAllEventsWeaviate = async (ctx: Koa.Context) => {
  try {
    const events = await weaviate_connection.getAllEvents()
    return (ctx.body = events)
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}


const eventQAWeaviate = async (ctx: Koa.Context) => {
  const question = ctx.request.query.question as string
  console.log("Inside EventQA", question)
  const answer = await weaviate_connection.searchEvents(question)
  console.log("Inside EventQA")
  console.log(answer)
  return (ctx.body = answer)
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
  {
    path: '/eventWeaviate',
    get: getEventsWeaviate,
    post: createEventWeaviate,
  },
  {
    path: '/eventQA',
    get: eventQAWeaviate,
  },{
    path: '/eventsWeaviate',
    get: getAllEventsWeaviate,
  }
]
