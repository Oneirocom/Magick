import { extractModuleInputKeys, Spell } from '@magickml/engine'
import { app } from "../app"
import Koa from 'koa'
import otJson0 from 'ot-json0'

import { Route } from '../types'
import { runSpell } from '../utils/runSpell'
import { ServerError } from '../utils/ServerError'

export const modules: Record<string, unknown> = {}

const runSpellHandler = async (ctx: Koa.Context) => {
  const { spell: spellName } = ctx.params

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

    const { outputs, name } = await runSpell({
      spellName,
      inputFormatter,
    })
    // Return the response
    ctx.body = { spell: name, outputs }
}

const saveDiffHandler = async (ctx: Koa.Context) => {
  const { body } = ctx.request
  const { name, diff } = body as any

  console.log('saving diff', name, diff)

  if (!body) throw new ServerError('input-failed', 'No parameters provided')

  let spell = await app.service('spells').find({ query: { name } })

  if (!spell)
    throw new ServerError('input-failed', `No spell with ${name} name found.`)
  if (!diff)
    throw new ServerError('input-failed', 'No diff provided in request body')

    const spellUpdate = otJson0.type.apply(spell, diff)

    if (Object.keys((spellUpdate as Spell).graph.nodes).length === 0)
      throw new ServerError(
        'input-failed',
        'Graph would be cleared.  Aborting.'
      )
  // in feathers.js, get the spells service and update the spell with the name of name
    const updatedSpell = await app.service('spells').update(name, spellUpdate)

    // get all entities from this spell and set to dirty
    await updatedSpell.agents.forEach(async entity => {
      // in feathers.js get the agents service and update the entity with the id of entity.id
      await app.service('agents').patch(entity, { dirty: true })
    })
    ctx.response.status = 200
    ctx.body = updatedSpell
}

export const spells: Route[] = [
  {
    path: '/spells/saveDiff',
    post: saveDiffHandler,
  },
  {
    path: '/spells/:spell',
    post: runSpellHandler,
  },
]
