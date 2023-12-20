import { NotFound } from '@feathersjs/errors/lib'
// DOCUMENTED
/**
 * Imports
 */
import otJson0 from 'ot-json0'
import md5 from 'md5'
import { KnexAdapter } from '@feathersjs/knex'
import { BadRequest } from '@feathersjs/errors/lib'
import type { Application } from '../../declarations'
import type { Paginated, Params } from '@feathersjs/feathers'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { SpellData, SpellPatch, SpellQuery } from './spells.schema'
import { SpellInterface } from 'server/schemas'
import { app } from '../../app'

/**
 * Interface and Types
 */
export type SpellParams = KnexAdapterParams<SpellQuery>
export type SaveDiffData = {
  name: string
  diff: Record<string, any>
  projectId: string
  spellReleaseId?: string
  spellId: string
}

/**
 * Spell Service
 * By default calls the standard Knex adapter service methods but can be customized with your own functionality.
 */
export class SpellService<
  ServiceParams extends Params = SpellParams
> extends KnexAdapter<SpellInterface, SpellData, ServiceParams, SpellPatch> {
  /**
   * @description Gets a spell by id or a versioned spell by spellReleaseId
   * @param spellId
   * @param params
   * @returns
   */
  async get(spellId: string, params: ServiceParams): Promise<SpellInterface> {
    const spellReleaseId = params.query?.spellReleaseId
    const query = super.createQuery(params)

    // Start building the query with the spell ID condition
    let spellQuery = query.where('spells.id', '=', spellId)

    // Conditionally add the spellReleaseId filter if it exists
    if (spellReleaseId) {
      spellQuery = spellQuery.andWhere(
        'spells.spellReleaseId',
        '=',
        spellReleaseId
      )
    }

    // Execute the query
    const spell = await spellQuery.first()

    if (!spell) {
      throw new NotFound(`No record found for id '${spellId}'`)
    }

    return spell
  }

  async find(params: ServiceParams) {
    // Check if params and params.query exist before proceeding
    if (params?.query) {
      for (const key in params.query) {
        if (Object.prototype.hasOwnProperty.call(params.query, key)) {
          if (params.query[key] === 'null') {
            params.query[key] = null
          }
        }
      }
    }
    return this._find(params) as Promise<Paginated<SpellInterface>>
  }

  async update(spellId: string, params: SpellData) {
    return this._update(spellId, params)
  }

  async create(params: SpellData) {
    app.get('logger').debug('Creating spell: %o', params)
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
  async saveDiff(data: SaveDiffData): Promise<SpellInterface> {
    const { name, diff, projectId, spellReleaseId, spellId } = data

    // Modify query to include spellReleaseId
    const query: Record<string, any> = { projectId, name }
    if (spellReleaseId) {
      query.spellReleaseId = spellReleaseId
    }

    // Find spell data
    const spell = await app.service('spells').get(spellId, {})

    if (!spell) {
      throw new NotFound(`No spell with name '${name}' found.`)
    }

    // Apply diff to spell data
    const spellUpdate = otJson0.type.apply(spell, diff)
    if (Object.keys(spellUpdate.graph.nodes).length === 0) {
      throw new BadRequest('Graph would be cleared. Aborting.')
    }

    // Calculate checksum of graph
    const hash = md5(JSON.stringify(spellUpdate.graph.nodes))
    app.get('logger').trace('Saving spell diff: %o', { name, diff })

    // Update spell data
    return await app
      .service('spells')
      .update(spell.id, { ...spellUpdate, hash })
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
