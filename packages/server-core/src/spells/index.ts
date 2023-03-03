import { Spell } from '@magickml/engine'
import { app } from "../app"
import Koa from 'koa'
import otJson0 from 'ot-json0'

import { Route } from '../types'
import { ServerError } from '../ServerError'

import md5 from 'md5'

const saveDiffHandler = async (ctx: Koa.Context) => {
  const { body } = ctx.request
  const { name, diff, projectId } = body as any

  if (!body) throw new ServerError('input-failed', 'No parameters provided')

  const spell = await app.service('spells').find({ query: { projectId, name } })

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

    const hash = md5(JSON.stringify(spellUpdate.graph.nodes))
  // in feathers.js, get the spells service and update the spell with the name of name
    const updatedSpell = await app.service('spells').update(name, {...spellUpdate, hash})

    ctx.response.status = 200
    ctx.body = updatedSpell
}

export const spells: Route[] = [
  {
    path: '/spells/saveDiff',
    post: saveDiffHandler,
  }
]
