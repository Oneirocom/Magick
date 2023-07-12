// DOCUMENTED
/**
 * For more information about this file see
 * https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
 */
import type { Id, Params, ServiceInterface } from '@feathersjs/feathers'
import { Agent, AgentManager } from '@magickml/agents'
import { Application, app } from '@magickml/server-core'
import type { Api, ApiData, ApiPatch, ApiQuery } from './api.schema'

export type { Api, ApiData, ApiPatch, ApiQuery }

/** Interface for API Service Options */
export interface ApiServiceOptions {
  app: Application
}

/** Type for API Params */
export type ApiParams = Params<ApiQuery>

/** Type for API GET Response */
export type ApiGetResponse = {
  result: Object
}
export class ApiService<ServiceParams extends ApiParams = ApiParams>
  implements ServiceInterface<Api, ApiData, ServiceParams, ApiPatch>
  {}

/** Helper function to get options for the ApiService. */
export const getOptions = (app: Application) => {
  return { app }
}
