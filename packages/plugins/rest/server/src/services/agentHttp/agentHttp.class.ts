// DOCUMENTED
/**
 * For more information about this file see
 * https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
 */
import { Application, app } from 'server/core'
import type { Agent } from 'server/agents'
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
import { getLogger } from 'server/logger'
import { CLOUD_AGENT_KEY, STANDALONE } from 'shared/config'

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
  const agent = await app.service('agents').get(agentId, {})
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

type Request = {
  agent: Agent
  agentId: string
  spellId: string
  sessionId?: string
  inputs: {
    [key: string]: {
      connector: string
      content: string
      sender: string
      observer: string
      client: string
      channel: string
      agentId: string
      entities: string[]
      channelType: string
      rawData: string
    }
  }
}

type RequestData = {
  content: string
  spellId?: string
  isCloud?: boolean
  sessionId?: string
  secrets?: {
    [key: string]: string
  }
  publicVariables?: {
    [key: string]: string
  }
  sender?: string
  client?: string
  channel?: string
}

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

const formatRequest = async (
  method: Method,
  agentId: string,
  data: RequestData,
  params: any
): Promise<Request> => {
  const {
    spellId,
    sessionId,
    content,
    isCloud = false,
    secrets = {},
    publicVariables = {},
    sender = 'api',
    client = 'rest',
    channel = 'rest',
  } = data

  // validate if method is GET, POST, PATCH, DELETE

  const validMethods = ['GET', 'POST', 'PATCH', 'DELETE']
  if (!validMethods.includes(method)) {
    throw new BadRequest('Invalid method')
  }

  const agent = await getAgent(
    agentId,
    (params?.headers && params.headers['authorization']) as string,
    isCloud || false
  )

  // check if public variables are a string, if they are parse them as json. Otherwise do nothing.
  const formattedPublicVariables =
    typeof publicVariables === 'string'
      ? JSON.parse(publicVariables)
      : publicVariables

  const agentPublicVariables =
    typeof agent.publicVariables === 'string'
      ? JSON.parse(agent.publicVariables)
      : agent.publicVariables

  method = method.toUpperCase() as Method

  return {
    agent,
    agentId: agent.id,
    spellId: spellId || (agent.rootSpellId as string),
    sessionId: sessionId,
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
        ...agentPublicVariables,
        ...formattedPublicVariables,
      },
      runSubspell: true,
      secrets: {
        ...agent.secrets,
        ...secrets,
      },
    },
  }
}

interface RecordMessageParams {
  agentId: string
  content: string
  sender: string | undefined
  connector: string
  conversationId: string | undefined
}

const recordMessage = ({ agentId, content, sender, connector, conversationId }: RecordMessageParams) => {
  app.service('chatMessages').create({
    agentId,
    content,
    sender,
    connector,
    conversationId,
  })
};

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

    if (!params.query) {
      throw new BadRequest('Query params are required')
    }

    recordMessage({
      agentId,
      content: params.query.content,
      sender: params.query.sender,
      connector: 'REST API (GET)',
      conversationId: params.query.conversationId,
    })

    const request = await formatRequest('GET', agentId, params.query, params)
    try {
      const result = await agentCommander.runSpellWithResponse(request) as { output: string }

      recordMessage({
        agentId,
        content: result['Output - Default'],
        sender: 'agent',
        connector: 'REST API (GET)',
        conversationId: params.query.conversationId,
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
    if (!data.agentId) {
      throw new BadRequest('Agent ID is required')
    }

    recordMessage({
      agentId: data.agentId,
      content: data.content,
      sender: data.sender,
      connector: 'REST API (POST)',
      conversationId: data.conversationId,
    })

    const agentCommander = app.get('agentCommander')

    const request = await formatRequest('POST', data.agentId, data, params)

    try {
      const result = await agentCommander.runSpellWithResponse(request) as { output: string }

      recordMessage({
        agentId: data.agentId,
        content: result['Output - Default'],
        sender: 'agent',
        connector: 'REST API (POST)',
        conversationId: data.conversationId,
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
    const agentCommander = app.get('agentCommander')

    recordMessage({
      agentId,
      content: data.content,
      sender: data.sender,
      connector: 'REST API (PUT)',
      conversationId: data.conversationId,
    })

    const request = await formatRequest('POST', agentId, data, params)

    try {
      const result = await agentCommander.runSpellWithResponse(request) as { output: string }

      recordMessage({
        agentId,
        content: result['Output - Default'],
        sender: 'agent',
        connector: 'REST API (PUT)',
        conversationId: data.conversationId,
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
    const agentCommander = app.get('agentCommander')

    if (!params.query) {
      throw new BadRequest('Query params are required')
    }

    params.query && recordMessage({
      agentId,
      content: params.query.content,
      sender: params.query.sender,
      connector: 'REST API (DELETE)',
      conversationId: params.query.conversationId,
    })

    const request = await formatRequest('DELETE', agentId, params.query, params)

    try {
      const result = await agentCommander.runSpellWithResponse(request) as { output: string }

      params.query && recordMessage({
        agentId,
        content: result['Output - Default'],
        sender: 'agent',
        connector: 'REST API (DELETE)',
        conversationId: params.query.conversationId,
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
