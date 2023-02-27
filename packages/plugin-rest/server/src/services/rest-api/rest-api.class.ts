// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '@magickml/server-core'

export type RestApi = any
export type RestApiData = any
export type RestApiPatch = any
export type RestApiQuery = any

export interface RestApiServiceOptions {
  app: Application
}

export interface RestApiParams extends Params<RestApiQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class RestApiService implements ServiceInterface<RestApi, RestApiData, RestApiParams, RestApiPatch> {
  constructor(public options: RestApiServiceOptions) {}

  async find(_params?: RestApiParams): Promise<RestApi[]> {
    return []
  }

  async get(id: Id, _params?: RestApiParams): Promise<RestApi> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: RestApiData, params?: RestApiParams): Promise<RestApi>
  async create(data: RestApiData[], params?: RestApiParams): Promise<RestApi[]>
  async create(data: RestApiData | RestApiData[], params?: RestApiParams): Promise<RestApi | RestApi[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: RestApiData, _params?: RestApiParams): Promise<RestApi> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: RestApiPatch, _params?: RestApiParams): Promise<RestApi> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: RestApiParams): Promise<RestApi> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
