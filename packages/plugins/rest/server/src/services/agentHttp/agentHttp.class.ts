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
    const { spellId, content } = params.query as AgentHttpData

    const agent = await getAgent(
      agentId,
      (params?.headers && params.headers['authorization']) as string,
      isCloud || false
    )

    const agentCommander = app.get('agentCommander')

    try {
      const result = await agentCommander.runSpellWithResponse({
        agent,
        spellId,
        inputs: {
          [`Input - REST API (GET)`]: {
            connector: 'REST API (GET)',
            content,
            sender: 'api',
            observer: agent.name,
            client: 'rest',
            channel: 'rest',
            agentId: agent.id,
            entities: ['api', agent.name],
            channelType: 'GET',
            rawData: '{}',
          },
          publicVariables: agent.publicVariables,
          runSubspell: true,
        },
      })

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
    const { content } = data
    const spellId = data?.spellId

    const agent = await getAgent(
      data.agentId,
      (params?.headers && params.headers['authorization']) as string,
      isCloud || false
    )

    const agentCommander = app.get('agentCommander')

    try {
      const result = await agentCommander.runSpellWithResponse({
        agent,
        spellId,
        inputs: {
          [`Input - REST API (POST)`]: {
            connector: 'REST API (POST)',
            content,
            sender: 'api',
            observer: agent.name,
            client: 'rest',
            channel: 'rest',
            agentId: agent.id,
            entities: ['api', agent.name],
            channelType: 'POST',
            rawData: '{}',
          },
          publicVariables: agent.publicVariables,
          runSubspell: true,
        },
      })

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
    const { content } = data
    const spellId = data?.spellId

    const agent = await getAgent(
      agentId,
      (params?.headers && params.headers['authorization']) as string,
      isCloud || false
    )

    const agentCommander = app.get('agentCommander')

    try {
      const result = await agentCommander.runSpellWithResponse({
        agent,
        spellId,
        inputs: {
          [`Input - REST API (UPDATE)`]: {
            connector: 'REST API (UPDATE)',
            content,
            sender: 'api',
            observer: agent.name,
            client: 'rest',
            channel: 'rest',
            agentId: agent.id,
            entities: ['api', agent.name],
            channelType: 'UPDATE',
            rawData: '{}',
          },
          publicVariables: agent.publicVariables,
          runSubspell: true,
        },
      })

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
    const { spellId, content } = params.query as AgentHttpData

    const agent = await getAgent(
      agentId,
      (params?.headers && params.headers['authorization']) as string,
      isCloud || false
    )

    const agentCommander = app.get('agentCommander')

    try {
      const result = await agentCommander.runSpellWithResponse({
        agent,
        spellId,
        inputs: {
          [`Input - REST API (DELETE)`]: {
            connector: 'REST API (DELETE)',
            content,
            sender: 'api',
            observer: agent.name,
            client: 'rest',
            channel: 'rest',
            agentId: agent.id,
            entities: ['api', agent.name],
            channelType: 'DELETE',
            rawData: '{}',
          },
          publicVariables: agent.publicVariables,
          runSubspell: true,
        },
      })

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
