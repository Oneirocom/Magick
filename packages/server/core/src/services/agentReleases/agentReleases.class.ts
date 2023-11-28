// DOCUMENTED
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexAdapter } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import { app } from '../../app'
import md5 from 'md5'
import type { Application } from '../../declarations'
import type { AgentRelease, AgentReleaseData, AgentReleasePatch, AgentReleaseQuery } from './agentReleases.schema'
import { NotFound } from '@feathersjs/errors'

// Define AgentReleasesParams type based on KnexAdapterParams with AgentQuery
export type AgentReleasesParams = KnexAdapterParams<AgentReleaseQuery>

/**
 * Default AgentReleasesService class.
 * Calls the standard Knex adapter service methods but can be customized with your own functionality.
 *
 * @template ServiceParams - The input params for the service
 * @extends KnexService
 */
export class AgentReleasesService<
  ServiceParams extends Params = AgentReleasesParams
> extends KnexAdapter<AgentReleaseData, AgentReleaseData, ServiceParams, AgentReleasePatch> {
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

  async create(
    data: AgentReleaseData
  ): Promise<AgentRelease> {
    return await this._create(data) as AgentRelease
  }

  async remove(agentId: string | null, params: ServiceParams) {
    return this._remove(agentId, params)
  }
}

/**
 * Returns options needed to initialize the AgentReleasesService.
 *
 * @param app - the Feathers application
 * @returns KnexAdapterOptions - options for initializing the Knex adapter
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'agentReleases',
    multi: ['remove'],
  }
}
