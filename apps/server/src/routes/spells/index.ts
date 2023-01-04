import Koa from 'koa'
import 'regenerator-runtime/runtime'
import { database } from '@thothai/database'
import { Route } from '../../types'
import { CustomError } from '../../utils/CustomError'
import {
  SpellRunner,
  GraphData,
  Spell as SpellType,
  extractModuleInputKeys,
} from '@thothai/core'
import { buildThothInterface } from './buildThothInterface'

import otJson0 from 'ot-json0'
import { Op } from 'sequelize'

export const modules: Record<string, unknown> = {}

const runSpellHandler = async (ctx: Koa.Context) => {
  const { spell } = ctx.params
  const { userGameState = {} } = ctx.request.body

  const rootSpell = await database.instance.models.spells.findOne({
    where: { name: spell },
  })

  //todo validate spell has an input trigger?

  if (!rootSpell?.graph) {
    throw new CustomError('not-found', `Spell with name ${spell} not found`)
  }

  // TODO use test spells if body option is given
  // const rootSpell = getTestSpell(spell)
  const graph = rootSpell.graph as GraphData
  // const modules = rootSpell.modules as Module[]

  // Build the interface
  const thothInterface = buildThothInterface(userGameState)

  // Extract any keys from the graphs inputs
  const inputKeys = extractModuleInputKeys(graph) as string[]

  // We should report on them here
  const inputs = inputKeys.reduce(
    (acc: { [x: string]: any[] }, input: string) => {
      const requestInput = ctx.request.body[input]

      if (requestInput) {
        acc[input] = requestInput
      } else {
        acc[input] = null
      }
      return acc
    },
    {} as Record<string, unknown>
  )

  const spellToRun = {
    // TOTAL HACK HERE
    ...(rootSpell as any).toJSON(),
    gameState: userGameState,
  }

  // Initialize the spell runner
  const spellRunner = new SpellRunner({ thothInterface })

  // Load the spell in to the spell runner
  await spellRunner.loadSpell(spellToRun as SpellType)

  try {
    // Get the outputs from running the spell
    const outputs = await spellRunner.defaultRun(inputs)

    // Get the updated state
    const state = thothInterface.getCurrentGameState()

    // Return the response
    ctx.body = { spell: rootSpell.name, outputs, state }
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
    // TODO eventually we should actually validate the body before dumping it in.
    await spell.update(body)
    return (ctx.body = { id: spell.id })
  }
}

const saveDiffHandler = async (ctx: Koa.Context) => {
  const { body } = ctx.request
  const { name, diff } = body

  console.log('body is', body)

  if (!body) throw new CustomError('input-failed', 'No parameters provided')

  const spell = await database.instance.models.spells.findOne({
    where: { name },
  })

  if (!spell)
    throw new CustomError('input-failed', `No spell with ${name} name found.`)
  if (!diff)
    throw new CustomError('input-failed', 'No diff provided in request body')
  console.log('spell is', spell)
  try {
    const spellUpdate = otJson0.type.apply(spell.toJSON(), diff)
    const updatedSpell = await database.instance.models.spells.update(
      spellUpdate,
      {
        where: { name },
      }
    )

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
  console.log('GETTING SPELLLLLLLL')
  const name = ctx.params.name
  try {
    const spell = await database.instance.models.spells.findOne({
      where: { name },
    })

    if (!spell) {
      const newSpell = await database.instance.models.spells.create({
        name,
        graph: { id: 'demo@0.1.0', nodes: {} },
        gameState: {},
        modules: [],
      })
      ctx.body = newSpell
    } else {
      ctx.body = spell
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
