// DOCUMENTED
/**
 * For more information about this file see
 * https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
 */
import { Application, app } from '@magickml/server-core'
import type { Agent } from '@magickml/agents'
import type { Params, ServiceInterface } from '@feathersjs/feathers'
import { GeneralError } from '@feathersjs/errors'
import type {
  AgentHttp,
  AgentHttpData,
  AgentHttpPatch,
  AgentHttpQuery,
} from './agentHttp.schema'
import { BadRequest, NotFound } from '@feathersjs/errors/lib'
import { pino } from 'pino'
import { getLogger } from '@magickml/core'
import { CLOUD_AGENT_KEY, STANDALONE } from '@magickml/config'

export type { AgentHttp, AgentHttpData, AgentHttpPatch, AgentHttpQuery }

/** Interface for AgentHttp Service Options */
export interface AgentHttpServiceOptions {
  app: Application
}

/** Type for AgentHttp Params */
export type AgentHttpParams = Params<AgentHttpQuery>

/** Type for AgentHttp GET Response */
export interface AgentHttpResponse {
  result: Object
}

export interface AgentHttpError {
  error: string
}

const getAgent = async (
  agentId: string,
  apiKey: string,
  isCloud: boolean
): Promise<Agent> => {
  const agent = await app.service('agents').get(agentId)
  if (!agent) {
    throw new NotFound('Agent not found with id ' + agentId)
  }

  if (!STANDALONE && isCloud) {
    if (apiKey !== CLOUD_AGENT_KEY) {
      throw new BadRequest('Invalid API KEY')
    }
  } else {
    if (!agent.data.rest_enabled) {
      throw new BadRequest('Agent does not have REST API enabled')
    }

    if (apiKey !== agent.data.rest_api_key) {
      throw new Error('Invalid API Key')
    }
  }

  // Trust the types
  return agent as unknown as Agent
}

const formatRequest = async (method, agentId, data, params) => {
  const {
    spellId,
    content,
    isCloud,
    secrets = {},
    publicVariables = {},
    sender = 'api',
    client = 'rest',
    channel = 'rest',
  } = data

  const agent = await getAgent(
    agentId,
    (params?.headers && params.headers['authorization']) as string,
    isCloud || false
  )

  method = method.toUpperCase()

  return {
    agent,
    spellId,
    inputs: {
      [`Input - REST API (${method})`]: {
        connector: `REST API (${method})`,
        content,
        sender: sender,
        observer: agent.name,
        client,
        channel: channel,
        agentId: agent.id,
        entities: [sender, agent.name],
        channelType: method,
        rawData: '{}',
      },
      publicVariables: {
        ...agent.publicVariables,
        ...publicVariables,
      },
      runSubspell: true,
      secrets: {
        ...agent.secrets,
        ...secrets,
      },
    },
  }
}

export class AgentHttpService<
  ServiceParams extends AgentHttpParams = AgentHttpParams
> implements
    ServiceInterface<
      AgentHttpResponse | AgentHttpError,
      AgentHttpData,
      ServiceParams,
      AgentHttpPatch
    >
{
  logger: pino.Logger = getLogger()

  // GET
  async get(
    agentId: string,
    params: ServiceParams
  ): Promise<AgentHttpResponse | AgentHttpError> {
    const agentCommander = app.get('agentCommander')

    const request = await formatRequest('GET', agentId, params.query, params)
    try {
      const result = await agentCommander.runSpellWithResponse(request)

      return {
        result: result as object,
      }
    } catch (err) {
      this.logger.error('Error in AgentHttpService.get: %s', err)
      throw new GeneralError({
        error: err,
      })
    }
  }

  async create(
    data: AgentHttpData,
    params: ServiceParams
  ): Promise<AgentHttpResponse | AgentHttpError> {
    if (!data.agentId) {
      throw new BadRequest('Agent ID is required')
    }

    const agentCommander = app.get('agentCommander')

    const request = await formatRequest('POST', data.agentId, data, params)

    try {
      const result = await agentCommander.runSpellWithResponse(request)

      return {
        result: result as object,
      }
    } catch (err) {
      this.logger.error('Error in AgentHttpService.create: %s', err)
      throw new GeneralError({
        error: err,
      })
    }
  }

  async update(
    agentId: string,
    data: AgentHttpData,
    params: ServiceParams
  ): Promise<AgentHttpResponse | AgentHttpError> {
    const agentCommander = app.get('agentCommander')

    const request = await formatRequest('POST', agentId, data, params)

    try {
      const result = await agentCommander.runSpellWithResponse(request)

      return {
        result: result as object,
      }
    } catch (err) {
      this.logger.error('Error in AgentHttpService.update: %s', err)
      throw new GeneralError({
        error: err,
      })
    }
  }

  async remove(
    agentId: string,
    params: ServiceParams
  ): Promise<AgentHttpResponse | AgentHttpError> {
    const agentCommander = app.get('agentCommander')

    const request = await formatRequest('DELETE', agentId, params.query, params)

    try {
      const result = await agentCommander.runSpellWithResponse(request)

      return {
        result: result as object,
      }
    } catch (err) {
      this.logger.error('Error in AgentHttpService.remove: %s', err)
      throw new GeneralError({
        error: err,
      })
    }
  }
}

/** Helper function to get options for the AgentHttpService. */
export const getOptions = (app: Application) => {
  return { app }
}
