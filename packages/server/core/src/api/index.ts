// DOCUMENTED
import { SpellError } from 'shared/core'
import { SpellInterface } from 'server/schemas'
import { app } from '../app'
import Koa from 'koa'
import otJson0 from 'ot-json0'

import { Route } from '../config/types'

import md5 from 'md5'

/**
 * Saves a diff of a spell and updates it.
 * @param {Koa.Context} ctx - The Koa context of the request.
 */
const saveDiffHandler = async (ctx: Koa.Context): Promise<void> => {
  const { body } = ctx.request
  const { name, diff, projectId } = body as any

  if (!body) throw new SpellError('input-failed', 'No parameters provided')

  const spell = await app.service('spells').find({ query: { projectId, name } })

  if (!spell)
    throw new SpellError('input-failed', `No spell with ${name} name found.`)
  if (!diff)
    throw new SpellError('input-failed', 'No diff provided in request body')

  const spellUpdate = otJson0.type.apply(spell, diff)

  if (Object.keys((spellUpdate as SpellInterface).graph.nodes).length === 0)
    throw new SpellError('input-failed', 'Graph would be cleared.  Aborting.')

  const hash = md5(JSON.stringify(spellUpdate.graph.nodes))

  // In feathers.js, get the spells service and update the spell with the name of 'name'.
  const updatedSpell = await app
    .service('spells')
    .update(name, { ...spellUpdate, hash })

  ctx.response.status = 200
  ctx.body = updatedSpell
}

/**
 * Export the spells routes for use in other modules.
 */
export const spells: Route[] = [
  {
    path: '/spells/saveDiff',
    post: saveDiffHandler,
  },
]
