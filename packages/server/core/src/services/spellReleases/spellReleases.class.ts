// DOCUMENTED
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexAdapter } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application } from '../../declarations'
import type {
  SpellRelease,
  SpellReleaseData,
  SpellReleasePatch,
  SpellReleaseQuery,
} from './spellReleases.schema'

// Define SpellReleasesParams type based on KnexAdapterParams with AgentQuery
export type SpellReleasesParams = KnexAdapterParams<SpellReleaseQuery>

/**
 * Default SpellReleasesService class.
 * Calls the standard Knex adapter service methods but can be customized with your own functionality.
 *
 * @template ServiceParams - The input params for the service
 * @extends KnexService
 */
export class SpellReleasesService<
  ServiceParams extends Params = SpellReleasesParams
> extends KnexAdapter<
  SpellReleaseData,
  SpellReleaseData,
  ServiceParams,
  SpellReleasePatch
> {
  app: Application

  constructor(options: KnexAdapterOptions, app: Application) {
    super(options)
    this.app = app
  }

  async get(agentId: string, params: ServiceParams) {
    this._get(agentId, params)
  }

  async find(params?: ServiceParams) {
    return await this._find(params)
  }

  async create(data: SpellReleaseData): Promise<SpellRelease> {
    return (await this._create(data)) as SpellRelease
  }

  async remove(agentId: string | null, params: ServiceParams) {
    return this._remove(agentId, params)
  }
}

/**
 * Returns options needed to initialize the SpellReleasesService.
 *
 * @param app - the Feathers application
 * @returns KnexAdapterOptions - options for initializing the Knex adapter
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'SpellReleases',
    multi: ['remove'],
  }
}
