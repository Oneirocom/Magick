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
    console.log('GET PARAMS', _params)
    const { payload } = _params as any // TODO: why is this error
    // payload is JSON encoded string
    const json = JSON.parse(payload)

    // get the agent service
    const agentService = this.options.app.service('agents')
    // get the agent by id
    const agent = await agentService.get(id)
    // get the selectedAgentData
    const selectedAgentData = agent.data
    console.log('AGENT DATA', selectedAgentData)
    // get the selectedAgentData's spells
    const rootSpell = JSON.parse(selectedAgentData.rootSpell)
    console.log('ROOT SPELL', rootSpell)
    // run the spell
    const result = await runSpell({
      id: rootSpell.id,
      projectId: agent.projectId,
      inputs: {
        'Input - REST API (GET)': { ...json.inputs },
      },
      secrets: payload.secrets ?? {},
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
    params?: ServiceParams
  ): Promise<Api | any /* TODO: type me */> {
    const { id } = params as any
    const { payload } = data as any
    const json = JSON.parse(payload)

    // get the agent service
    const agentService = this.options.app.service('agents')
    // get the agent by id
    const agent = await agentService.get(id)
    // get the selectedAgentData
    const selectedAgentData = agent.data
    console.log('AGENT DATA', selectedAgentData)
    // get the selectedAgentData's spells
    const rootSpell = selectedAgentData.rootSpell
    console.log('ROOT SPELL', rootSpell)
    // run the spell
    const result = await runSpell({
      id: rootSpell.id,
      projectId: agent.projectId,
      inputs: {
        'Input - REST API (POST)': { ...json.inputs },
      },
      secrets: payload.secrets ?? {},
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
    const { payload } = data as any
    const json = JSON.parse(payload)

    // get the agent service
    const agentService = this.options.app.service('agents')
    // get the agent by id
    const agent = await agentService.get(id)
    // get the selectedAgentData
    const selectedAgentData = agent.data
    console.log('AGENT DATA', selectedAgentData)
    // get the selectedAgentData's spells
    const rootSpell = selectedAgentData.rootSpell
    console.log('ROOT SPELL', rootSpell)
    // run the spell
    const result = await runSpell({
      id: rootSpell.id,
      projectId: agent.projectId,
      inputs: {
        'Input - REST API (PUT)': { ...json.inputs },
      },
      secrets: payload.secrets ?? {},
      publicVariables: agent.publicVariables,
    })

    return {
      result,
    }
  }

  async patch(
    id: Id,
    data: ApiPatch,
    _params?: ServiceParams
  ): Promise<Api | any> {
    const { payload } = data as any
    const json = JSON.parse(payload)

    // get the agent service
    const agentService = this.options.app.service('agents')
    // get the agent by id
    const agent = await agentService.get(id)
    // get the selectedAgentData
    const selectedAgentData = agent.data
    console.log('AGENT DATA', selectedAgentData)
    // get the selectedAgentData's spells
    const rootSpell = selectedAgentData.rootSpell
    console.log('ROOT SPELL', rootSpell)
    // run the spell
    const result = await runSpell({
      id: rootSpell.id,
      projectId: agent.projectId,
      inputs: {
        'Input - REST API (PATCH)': { ...json.inputs },
      },
      secrets: payload.secrets ?? {},
      publicVariables: agent.publicVariables,
    })

    return {
      result,
    }
  }

  async remove(id: Id, _params?: ServiceParams): Promise<Api | any> {
    const { payload } = _params as any
    const json = JSON.parse(payload)

    // get the agent service
    const agentService = this.options.app.service('agents')
    // get the agent by id
    const agent = await agentService.get(id)
    // get the selectedAgentData
    const selectedAgentData = agent.data
    console.log('AGENT DATA', selectedAgentData)
    // get the selectedAgentData's spells
    const rootSpell = selectedAgentData.rootSpell
    console.log('ROOT SPELL', rootSpell)
    // run the spell
    const result = await runSpell({
      id: rootSpell.id,
      projectId: agent.projectId,
      inputs: {
        'Input - REST API (DELETE)': { ...json.inputs },
      },
      secrets: payload.secrets ?? {},
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
