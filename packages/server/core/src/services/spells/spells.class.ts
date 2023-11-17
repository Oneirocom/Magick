// DOCUMENTED
/**
 * Imports
 */
import otJson0 from 'ot-json0'
import md5 from 'md5'
import { KnexAdapter } from '@feathersjs/knex'
import { BadRequest, NotFound } from '@feathersjs/errors/lib'
import type { Application } from '../../declarations'
import type { Paginated, Params } from '@feathersjs/feathers'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { SpellData, SpellPatch, SpellQuery } from './spells.schema'
import type { SpellInterface } from 'shared/core'
import { app } from '../../app'

/**
 * Interface and Types
 */
export type SpellParams = KnexAdapterParams<SpellQuery>
export type SaveDiffData = {
  name: string
  diff: Record<string, any>
  projectId: string
}

/**
 * Spell Service
 * By default calls the standard Knex adapter service methods but can be customized with your own functionality.
 */
export class SpellService<
  ServiceParams extends Params = SpellParams
> extends KnexAdapter<SpellInterface, SpellData, ServiceParams, SpellPatch> {

  async get(spellId: string, params: ServiceParams) {
    const db = app.get('dbClient')
    const { versionId } = params.query

    const query = super.createQuery(params)

    if (spellId && !versionId) {
      const count = await db('agentReleases').count('*').as('count').where('id', '=', versionId)

      if (count["count"] > 0) {
        query
          .leftJoin('agentRelease as releases', function() {
            this.on('agents.id', '=', 'agentReleases.agentId')
          })
      }

    } else if(spellId && versionId) {
      query
        .leftJoin('agentRelease as releases', function() {
          this.on('spelld.versionId', '=', 'agentReleases.id').andOn(versionId, '=', 'agentReleases.id')
        })
    }

    const data = await query.andWhere('spells.id', '=', spellId)
    if (data.length !== 1) {
      throw new NotFound(`No record found for id '${spellId}'`)
    }

    return data
  }

  async find(params: ServiceParams) {
    return this._find(params)
  }

  async update(spellId: string, params: SpellData) {
    return this._update(spellId, params)
  }

  async create(params: SpellData) {
    return this._create(params)
  }

  async patch(spellId: string, params: SpellPatch) {
    return this._patch(spellId, params)
  }

  async remove(spellId: string | null, params: ServiceParams) {
    return this._remove(spellId, params)
  }

  /**
   * Saves the diff of a spell
   */
  async saveDiff(data: SaveDiffData) {
    const { name, diff, projectId } = data

    // Find spell data
    const spellData = await app
      .service('spells')
      .find({ query: { projectId, name } })
    const spell = spellData[0]

    // Check if spell exists and that diff is available
    if (!spell) throw new BadRequest(`No spell with ${name} name found.`)
    if (!diff) throw new BadRequest('No diff provided in request body')

    // Apply diff to spell data
    const spellUpdate = otJson0.type.apply(spell, diff)

    // Check if the graph would be cleared
    if (Object.keys(spellUpdate.graph.nodes).length === 0) {
      throw new BadRequest('Graph would be cleared. Aborting.')
    }

    // Calculate checksum of graph
    const hash = md5(JSON.stringify(spellUpdate.graph.nodes))

    app.get('logger').trace('Saving spell diff: %o', {
      name,
      diff,
    })

    // Update spell data
    const updatedSpell = await app
      .service('spells')
      .update(spell.id, { ...spellUpdate, hash })

    return updatedSpell
  }
}

/**
 * Returns options for KnexAdapter
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: {
      default: 1000,
      max: 1000,
    },
    Model: app.get('dbClient'),
    name: 'spells',
    multi: ['remove'],
  }
}
