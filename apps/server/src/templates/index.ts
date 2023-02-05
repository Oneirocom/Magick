import { extractModuleInputKeys, Spell } from '@magickml/core'
import { prisma } from '@magickml/prisma'
import Koa from 'koa'
import otJson0 from 'ot-json0'
import 'regenerator-runtime/runtime'
import { v4 as uuidv4 } from 'uuid'

import { Route } from '../types'
import { CustomError } from '../utils/CustomError'
import { runSpell } from '../utils/runSpell'

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

    const { outputs, state, name } = await runSpell({
      spellName,
      state: userGameState,
      inputFormatter,
    })
    // Return the response
    ctx.body = { spell: name, outputs, state }
}

const saveHandler = async (ctx: Koa.Context) => {
  console.log('saving spell to dat')
  const body =
    typeof ctx.request.body === 'string'
      ? JSON.parse(ctx.request.body)
      : ctx.request.body

  if (!body) throw new CustomError('input-failed', 'No parameters provided')

  const spell = await prisma.spells.findUnique({ where: { id: body.id } })

  if (!spell) {
    // if no id, generate a uuid
    const newSpell = await prisma.spells.create({
      data: {
        id: body.id ?? uuidv4(),
        name: body.name,
        graph: body.graph,
        gameState: body.gameState || {},
        modules: body.modules || [],
      },
    })
    return (ctx.body = { id: newSpell.id })
  } else {
    await prisma.spells.update({
      where: { id: body.id },
      data: {
        name: body.name,
        graph: body.graph,
        gameState: body.gameState || {},
        modules: body.modules || [],
      },
    })

    return (ctx.body = { id: spell.id })
  }
}

const saveDiffHandler = async (ctx: Koa.Context) => {
  const { body } = ctx.request
  const { name, diff } = body

  console.log('saving diff', name, diff)

  if (!body) throw new CustomError('input-failed', 'No parameters provided')

  let spell = await prisma.spells.findUnique({ where: { name } })

  if (!spell)
    throw new CustomError('input-failed', `No spell with ${name} name found.`)
  if (!diff)
    throw new CustomError('input-failed', 'No diff provided in request body')

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
        agents: true,
      },
    })

    // get all entities from this spell and set to dirty
    await updatedSpell.agents.forEach(async entity => {
      await prisma.agents.update({
        where: { id: entity.id },
        data: {
          dirty: true,
        },
      })
    })

    ctx.response.status = 200
    ctx.body = updatedSpell
}

const newHandler = async (ctx: Koa.Context) => {
  const body = ctx.request.body
  if (!body) throw new CustomError('input-failed', 'No parameters provided')

  const missingBody = ['graph', 'name'].filter(property => !body[property])

  if (missingBody.length > 0) {
    const message = `Request body missing ${missingBody.join(', ')} values`
    throw new CustomError('input-failed', message)
  }

  const spell = await prisma.spells.findUnique({ where: { name: body.name } })

  // rewrite this to use prisma
  if (spell) throw new CustomError('input-failed', 'spell already exists')

  const newSpell = await prisma.spells.create({
    data: {
      id: uuidv4(),
      name: body.name,
      graph: body.graph,
      gameState: {},
      modules: [],
    },
  })

  return (ctx.body = newSpell)
}

const patchHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name

  const spell = await prisma.spells.findUnique({ where: { name } })

  if (!spell) throw new CustomError('input-failed', 'spell not found')

  await prisma.spells.update({
    where: { name },
    data: ctx.request.body,
  })

  return (ctx.body = { id: spell.id })
}

const getTemplatesHandler = async (ctx: Koa.Context) => {
  const templates = await prisma.spells.findMany()

  return (ctx.body = templates)
}

const getSpellHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name
  try {
    const spell = await prisma.spells.findUnique({ where: { name } })

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
    const spell = await prisma.spells.findUnique({ where: { name } })

    if (spell) return (ctx.body = true)

    ctx.body = false
  } catch (err) {
    ctx.body = false
  }
}

const deleteHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name

  const spell = await prisma.spells.findUnique({ where: { name } })

  if (!spell) throw new CustomError('input-failed', 'spell not found')

  try {
    await prisma.spells.delete({ where: { name } })

    ctx.body = true
  } catch (err) {
    throw new CustomError('server-error', 'error deleting spell')
  }
}

export const templates: Route[] = [
  {
    path: '/templates',
    get: getTemplatesHandler,
    post: newHandler,
  },
]
