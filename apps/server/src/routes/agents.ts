import { database } from '@magickml/database'
import 'regenerator-runtime/runtime'
import Koa from 'koa'
import 'regenerator-runtime/runtime'
import { Route } from '../types'
import { prisma } from '@magickml/prisma'

export const modules: Record<string, unknown> = {}

const getAgentsHandler = async (ctx: Koa.Context) => {
  try {
    let data = await database.getEntities()
    return (ctx.body = data)
  } catch (e) {
    console.log('getAgentsHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const getAgentHandler = async (ctx: Koa.Context) => {
  const instanceId = ctx.request.query.instanceId as string
  if (!instanceId) {
    ctx.status = 400
    return (ctx.body = { error: 'missing instanceId' })
  }

  const isNum = /^\d+$/.test(instanceId)
  if (!isNum) {
    ctx.status = 400
    return (ctx.body = { error: 'instanceId is not a number' })
  }

  const _instanceId = parseInt(instanceId)
  try {
    let data = await database.getEntity(_instanceId) as any
    if (data === undefined || !data) {
      let newId = _instanceId
      while ((await database.entityExists(newId)) || newId <= 0) {
        newId++
      }

      data = {
        id: newId,
        enabled: true,
      }
    }
    return (ctx.body = data)
  } catch (e) {
    console.log('getAgentHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const addAgentHandler = async (ctx: Koa.Context) => {
  const data = ctx.request.body
  if(!data.data) {
    data.data = ""
    data.dirty = true
    data.enabled = false
  }

  if (typeof data.data === 'object') {
    data.data = JSON.stringify(data.data)
  }

  const entity = await prisma.agents.findFirst({
    where: {
      id: data.id,
    },
  })

  // if entity exists, update it
  if (entity) {
    await prisma.agents.update({
      where: {
        id: data.id,
      },
      data: {
        id: data.id,
        data: data.data as string,
        dirty: data.dirty,
        enabled: data.enabled,
      },
    })
    return (ctx.body = { id: data.id })
  }

  try {
    console.log('updated agent database with', data)
    // if data.data is an object, stringify it

    return (ctx.body = await prisma.agents.create({ data }))
  } catch (e) {
    console.log('addAgentHandler:', e)
    ctx.status = 500
    return (ctx.body = { error: 'internal error' })
  }
}

const deleteAgentHandler = async (ctx: Koa.Context) => {
  const { id } = ctx.params

  try {
    return (ctx.body = await database.deleteEntity(id))
  } catch (e) {
    console.log(e)
    ctx.status = 500
    return (ctx.body = 'internal error')
  }
}

export const agents: Route[] = [
  {
    path: '/agents',
    get: getAgentsHandler,
  },
  {
    path: '/agent',
    get: getAgentHandler,
    post: addAgentHandler,
  },
  {
    path: '/agent/:id',
    delete: deleteAgentHandler,
  },
]
