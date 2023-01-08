import Koa from 'koa'
import 'regenerator-runtime/runtime'
import { database } from '@magickml/database'
import { Route } from '../../types'
import { CustomError } from '../../utils/CustomError'
import { extractModuleInputKeys, Spell } from '@magickml/core'

import otJson0 from 'ot-json0'
import { Op } from 'sequelize'
import { runSpell } from '../utils/runSpell'
import { prisma } from '@magickml/prisma'

export const modules: Record<string, unknown> = {}

const runSpellHandler = async (ctx: Koa.Context) => {
  const { spell: spellName } = ctx.params
  const { userGameState = {} } = ctx.request.body

  const inputFormatter = graph => {
    // Extract any keys from the graphs inputs
    const inputKeys = extractModuleInputKeys(graph) as string[]

    // We should report on them here
    return inputKeys.reduce((acc: { [x: string]: any[] }, input: string) => {
      const requestInput = ctx.request.body[input]

      if (requestInput) {
        acc[input] = requestInput
      } else {
        acc[input] = null
      }
      return acc
    }, {} as Record<string, unknown>)
  }

  try {
    const { outputs, state, name } = await runSpell({
      spellName,
      state: userGameState,
      inputFormatter,
    })
    // Return the response
    ctx.body = { spell: name, outputs, state }
  } catch (err) {
    // return any errors
    console.error(err)
    throw new CustomError('server-error', err.message)
  }
}

const saveHandler = async (ctx: Koa.Context) => {
  const body =
    typeof ctx.request.body === 'string'
      ? JSON.parse(ctx.request.body)
      : ctx.request.body

  if (!body) throw new CustomError('input-failed', 'No parameters provided')

  const spell = await database.instance.models.spells.findOne({
    where: { id: body.id },
  })

  if (!spell) {
    const newSpell = await database.instance.models.spells.create({
      name: body.name,
      graph: body.graph,
      gameState: body.gameState || {},
      modules: body.modules || [],
    })
    return (ctx.body = { id: newSpell.id })
  } else {
    if (Object.keys(body.graph.nodes).length === 0)
      throw new CustomError('input-failed', 'No nodes provided in request body')
    else {
      await spell.update(body)
      return (ctx.body = { id: spell.id })
    }
  }
}

const saveDiffHandler = async (ctx: Koa.Context) => {
  const { body } = ctx.request
  const { name, diff } = body

  if (!body) throw new CustomError('input-failed', 'No parameters provided')

  const spell = await prisma.spells.findUnique({
    where: { name },
  })

  if (!spell)
    throw new CustomError('input-failed', `No spell with ${name} name found.`)
  if (!diff)
    throw new CustomError('input-failed', 'No diff provided in request body')

  try {
    const spellUpdate = otJson0.type.apply(spell, diff)

    if (Object.keys((spellUpdate as Spell).graph.nodes).length === 0)
      throw new CustomError(
        'input-failed',
        'Graph would be cleared.  Aborting.'
      )

    const updatedSpell = await prisma.spells.update({
      where: { name },
      data: spellUpdate,
      include: {
        entities: true,
      },
    })

    // get all entities from this spell and set to dirty
    await updatedSpell.entities.forEach(async entity => {
      await prisma.entities.update({
        where: { id: entity.id },
        data: {
          dirty: true,
        },
      })
    })

    ctx.response.status = 200
    ctx.body = updatedSpell
  } catch (err) {
    throw new CustomError('server-error', 'Error processing diff.', err)
  }
}

const newHandler = async (ctx: Koa.Context) => {
  const body = ctx.request.body
  if (!body) throw new CustomError('input-failed', 'No parameters provided')

  const missingBody = ['graph', 'name'].filter(property => !body[property])

  if (missingBody.length > 0) {
    const message = `Request body missing ${missingBody.join(', ')} values`
    throw new CustomError('input-failed', message)
  }

  // TODO fix these typescript errors
  //@ts-ignore
  const spell = await database.instance.models.spells.findOne({
    //@ts-ignore
    where: {
      name: body.name,
      deletedAt: { [Op.ne]: null },
    },
    paranoid: false,
  })

  if (spell) await spell.destroy({ force: true })

  const newSpell = await database.instance.models.spells.create({
    name: body.name,
    graph: body.graph,
    gameState: {},
    modules: [],
  })

  return (ctx.body = newSpell)
}

const patchHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name
  const spell = await database.instance.models.spells.findOne({
    where: {
      name,
    },
  })
  if (!spell) throw new CustomError('input-failed', 'spell not found')

  await spell.update(ctx.request.body)

  return (ctx.body = { id: spell.id })
}

const getSpellsHandler = async (ctx: Koa.Context) => {
  let queryBody: any = {}
  const spells = await database.instance.models.spells.findAll({
    ...queryBody,
    attributes: {
      exclude: ['graph', 'gameState', 'modules'],
    },
  })
  ctx.body = spells
}

const getSpellHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name
  try {
    const spell = await database.instance.models.spells.findOne({
      where: { name },
    })

    if (!spell) {
      throw new Error('Spell not found')
    } else {
      return (ctx.body = spell)
    }
  } catch (e) {
    console.error(e)
  }
}

// TODO create a 'build handler' WHOF that can take in things like an array of required params and parse errors, etc.

const postSpellExistsHandler = async (ctx: Koa.Context) => {
  const body = ctx.request.body
  if (!body) throw new CustomError('input-failed', 'No parameters provided')

  const missingBody = ['name'].filter(property => !body[property])

  if (missingBody.length > 0) {
    const message = `Request body missing ${missingBody.join(', ')} values`
    throw new CustomError('input-failed', message)
  }

  const { name } = ctx.body as { name: string }

  try {
    const spell = await database.instance.models.spells.findOne({
      where: { name },
    })

    if (spell) return (ctx.body = true)

    ctx.body = false
  } catch (err) {
    ctx.body = false
  }
}

const deleteHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name
  const spell = await database.instance.models.spells.findOne({
    where: { name },
  })
  if (!spell) throw new CustomError('input-failed', 'spell not found')

  try {
    await spell.destroy()

    ctx.body = true
  } catch (err) {
    throw new CustomError('server-error', 'error deleting spell')
  }
}

export const spells: Route[] = [
  {
    path: '/spells/save',
    post: saveHandler,
  },
  {
    path: '/spells/saveDiff',
    post: saveDiffHandler,
  },
  {
    path: '/spells/:name',
    patch: patchHandler,
    delete: deleteHandler,
    get: getSpellHandler,
  },
  {
    path: '/spells',
    get: getSpellsHandler,
    post: newHandler,
  },
  {
    path: '/spells/exists',
    post: postSpellExistsHandler,
  },
  {
    path: '/spells/:spell',
    post: runSpellHandler,
  },
]
