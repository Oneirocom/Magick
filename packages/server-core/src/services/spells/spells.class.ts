import otJson0 from 'ot-json0'
import md5 from 'md5'
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Spell, SpellData, SpellPatch, SpellQuery } from './spells.schema'
import { app } from '../../app'
import { BadRequest } from '@feathersjs/errors/lib'

export type SpellParams = KnexAdapterParams<SpellQuery>

export type SaveDiffData = {
  name: string
  diff: Record<string, any>
  projectId: string
}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class SpellService<ServiceParams extends Params = SpellParams> extends KnexService<
  Spell,
  SpellData,
  ServiceParams,
  SpellPatch
> {
  async saveDiff(data: SaveDiffData) {
    const { name, diff, projectId } = data

    const spellData = await app.service('spells').find({ query: { projectId, name } })
    const spell = spellData.data[0]

    if (!spell) throw new BadRequest(`No spell with ${name} name found.`)
    if (!diff) throw new BadRequest('No diff provided in request body')

    const spellUpdate = otJson0.type.apply(spell, diff)

    if (Object.keys((spellUpdate as Spell).graph.nodes).length === 0)
      throw new BadRequest('Graph would be cleared.  Aborting.')

    const hash = md5(JSON.stringify(spellUpdate.graph.nodes))

    const updatedSpell = await app.service('spells').update(spell.id, { ...spellUpdate, hash })

    return updatedSpell
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'spells'
  }
}
