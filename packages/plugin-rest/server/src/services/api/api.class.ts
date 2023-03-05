// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type {
  Id,
  Params,
  ServiceInterface,
} from '@feathersjs/feathers'

import { Application, runSpell } from '@magickml/server-core'
import type { Api, ApiData, ApiPatch, ApiQuery } from './api.schema'

export type { Api, ApiData, ApiPatch, ApiQuery }

export interface ApiServiceOptions {
  app: Application
}

export interface ApiParams extends Params<ApiQuery> {}

export type ApiGetResponse = {
  result: Object
}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class ApiService<ServiceParams extends ApiParams = ApiParams>
  implements ServiceInterface<Api, ApiData, ServiceParams, ApiPatch>
{
  constructor(public options: ApiServiceOptions) {}

  async get(
    id: Id,
    _params?: ServiceParams
  ): Promise<ApiGetResponse | any /* TODO: remove */> {
    const { apiKey, content } = _params?.query as any // TODO: why is this error
    // if apiKey is null, return an error
    if (!apiKey) {
      return {
        error: 'The `apiKey` field is required',
      }
    }

    if(!content) {
      return {
        error: 'The `content` field is required. if you want to pass an object, stringify it first',
      }
    }
    // get the agent service
    const agentService = this.options.app.service('agents')
    // get the agent by id
    const agent = await agentService.get(id)
    // get the selectedAgentData's spells
    const rootSpell = JSON.parse(agent.rootSpell ?? '{}')
    // run the spell
    const result = await runSpell({
      id: rootSpell.id,
      projectId: agent.projectId,
      inputs: {
        'Input - REST API (GET)': {
          content,
        },
      },
      secrets: JSON.parse(agent.secrets ?? '{}'),
      publicVariables: agent.publicVariables,
    })

    return {
      result,
    }
  }

  async create(data: ApiData, params?: ServiceParams): Promise<Api>
  async create(data: ApiData[], params?: ServiceParams): Promise<Api[]>
  async create(
    data: ApiData | ApiData[],
    params: ServiceParams
  ): Promise<Api | any /* TODO: type me */> {
    // get the params from the data
    const { id, content, apiKey } = data as any
    // get the agent service
    const agentService = this.options.app.service('agents')
    // get the agent by id
    const agent = await agentService.get(id)
    // get the selectedAgentData
    // get the selectedAgentData's spells
    const rootSpell = JSON.parse(agent.rootSpell ?? '{}')
    console.log('ROOT SPELL', rootSpell)
    // run the spell
    const result = await runSpell({
      id: rootSpell.id,
      projectId: agent.projectId,
      inputs: {
        'Input - REST API (POST)': { content },
      },
      secrets: JSON.parse(agent.secrets ?? '{}'),
      publicVariables: agent.publicVariables,
    })

    return {
      result,
    }
  }

  async update(
    id: Id,
    data: ApiData,
    _params?: ServiceParams
  ): Promise<Api | any> {
    const { content, apiKey } = data as any
    // get the agent service
    const agentService = this.options.app.service('agents')
    // get the agent by id
    const agent = await agentService.get(id)
    // get the selectedAgentData
    const rootSpell = JSON.parse(agent.rootSpell ?? '{}')
    // run the spell
    const result = await runSpell({
      id: rootSpell.id,
      projectId: agent.projectId,
      inputs: {
        'Input - REST API (PUT)': { content },
      },
      secrets: JSON.parse(agent.secrets ?? '{}'),
      publicVariables: agent.publicVariables,
    })

    return {
      result,
    }
  }

  async remove(id: Id, _params?: ServiceParams): Promise<Api | any> {

    const { content, apiKey } = _params?.query as any

    // get the agent service
    const agentService = this.options.app.service('agents')
    // get the agent by id
    const agent = await agentService.get(id)
    // get the selectedAgentData's spells
    const rootSpell = JSON.parse(agent.rootSpell ?? '{}')
    // run the spell
    const result = await runSpell({
      id: rootSpell.id,
      projectId: agent.projectId,
      inputs: {
        'Input - REST API (DELETE)': { content },
      },
      secrets: JSON.parse(agent.secrets ?? '{}'),
      publicVariables: agent.publicVariables,
    })

    return {
      result,
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
