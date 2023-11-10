// DOCUMENTED
/**
 * Imports
 */
import otJson0 from 'ot-json0'
import md5 from 'md5'
import { KnexService } from '@feathersjs/knex'
import { BadRequest } from '@feathersjs/errors/lib'
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
> extends KnexService<SpellInterface, SpellData, ServiceParams, SpellPatch> {

  async get(spellId: string, params: ServiceParams) {
    const { releaseVersion } = params
    const db = app.get('dbClient')

    let spells: SpellData[];

    if (releaseVersion) {
      spells = db('spells')
        .select('spells.*')
        .innerJoin('agentReleases', 'spells.projectId', 'agentReleases.projectId')
        .where('agentReleases.releaseVersion', releaseVersion)
        .groupBy('spells.id') as SpellData
    } else {
      spells = db('spells')
        .select('spells.*')
        .innerJoin('agentReleases', 'spells.currentReleaseVersionId', 'agentReleases.id')
        .groupBy('spells.id')
    }

    return agents
  }

  async find(params?: ServiceParams): Promise<SpellData[] | Paginated<SpellData>> {
    // Modify the query to exclude agents with the frozen flag set
    const { query = {} } = params || {};
    query.frozen ||= false;  // Only fetch agents where frozen is false

    // Call the original find method with the modified query
    return super.find({ ...params, query });
  }

  /**
   * Saves the diff of a spell
   */
  async saveDiff(data: SaveDiffData) {
    const { name, diff, projectId } = data

    // Find spell data
    const spellData = await app
      .service('spells')
      .find({ query: { projectId, name, frozen: false } })
    const spell = spellData.data[0]

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
