// DOCUMENTED
/**
 * For more information about this file see
 * https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
 */
import { Application, app } from '@magickml/server-core'
import type { Agent } from '@magickml/agents'
import type { Params, ServiceInterface } from '@feathersjs/feathers'
import type { Api, ApiData, ApiPatch, ApiQuery } from './api.schema'

export type { Api, ApiData, ApiPatch, ApiQuery }

/** Interface for API Service Options */
export interface ApiServiceOptions {
  app: Application
}

/** Type for API Params */
export type ApiParams = Params<ApiQuery>

/** Type for API GET Response */
export interface ApiResponse {
  result: Object
}

export interface ApiError {
  error: string
}

export class ApiService<ServiceParams extends ApiParams = ApiParams>
  implements ServiceInterface<ApiResponse | ApiError, ApiData, ServiceParams, ApiPatch>
  {

    // GET
    async find(params: ServiceParams): Promise<ApiResponse | ApiError> {
      const { spellId, content } = params.query as ApiData

      const agentCommander = app.get('agentCommander')

      // little hack since we dynamically add agents to the params in the hooks
      const agent = (params as unknown as { agent: Agent }).agent

      const result = await agentCommander.runSpellWithResponse({
        agent,
        spellId,
        inputs: {
          [`Input - REST API (GET)`]: {
            connector: "REST API (GET)",
            content,
            sender: 'api',
            observer: agent.name,
            client: 'rest',
            channel: 'rest',
            agentId: agent.id,
            entities: ['api', agent.name],
            channelType: 'GET',
            rawData: "{}"
          },
          publicVariables: agent.publicVariables,
          runSubspell: true
        }
      })

      return {
        result: result as object
      }
    }

    async create(data: ApiData, params: ServiceParams): Promise<ApiResponse | ApiError> {
      const { spellId, content } = params.query as ApiData

      const agentCommander = app.get('agentCommander')

      // little hack since we dynamically add agents to the params in the hooks
      const agent = (params as unknown as { agent: Agent }).agent

      const result = await agentCommander.runSpellWithResponse({
        agent,
        spellId,
        inputs: {
          [`Input - REST API (POST)`]: {
            connector: "REST API (POST)",
            content,
            sender: 'api',
            observer: agent.name,
            client: 'rest',
            channel: 'rest',
            agentId: agent.id,
            entities: ['api', agent.name],
            channelType: 'POST',
            rawData: "{}"
          },
          publicVariables: agent.publicVariables,
          runSubspell: true
        }
      })

      return {
        result: result as object
      }
    }
  }

/** Helper function to get options for the ApiService. */
export const getOptions = (app: Application) => {
  return { app }
}
