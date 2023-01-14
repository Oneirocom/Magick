import { database } from '@magickml/database'
import 'regenerator-runtime/runtime'
//@ts-ignore
// import weaviate from 'weaviate-client'
import Koa from 'koa'
import 'regenerator-runtime/runtime'
import { Route } from '../types'
import { makeCompletion } from '../utils/MakeCompletionRequest'
import { MakeModelRequest } from '../utils/MakeModelRequest'
import { queryGoogleSearch } from './utils/queryGoogle'
import { tts, tts_tiktalknet } from '@magickml/systems'
import { prisma } from '@magickml/prisma'
import { CustomError } from '../utils/CustomError'

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

    const agent = ctx.request.body.agent
    const speaker = ctx.request.body.speaker
    const sender = ctx.request.body.sender
    const client = ctx.request.body.client
    const channel = ctx.request.body.channel
    const text = ctx.request.body.text
    const type = ctx.request.body.type
    const date = ctx.request.body.date

    const res = await database.updateEvent(id, {
      agent,
      speaker,
      sender,
      client,
      channel,
      text,
      type,
      date,
    })
    return (ctx.body = res)
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}

const createEvent = async (ctx: Koa.Context) => {
  const agent = ctx.request.body.agent
  const speaker = ctx.request.body.speaker
  const client = ctx.request.body.client
  const sender = ctx.request.body.sender
  const channel = ctx.request.body.channel
  const text = ctx.request.body.text
  const type = ctx.request.body.type
  console.log('Creating event:', agent, speaker, client, channel, text, type)

  // Todo needs error handling
  await database.createEvent({
    type,
    agent,
    speaker,
    sender,
    client,
    channel,
    text,
  })

  return (ctx.body = 'ok')
}
export const agents: Route[] = [
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
