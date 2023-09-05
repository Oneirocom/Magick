import { Application, app } from '@magickml/server-core'
import type { Agent } from '@magickml/agents'
import type { Params, ServiceInterface } from '@feathersjs/feathers'
import type { Slack } from './slack.schema'
import { BadRequest, NotFound, GeneralError } from '@feathersjs/errors/lib'
import { pino } from 'pino'
import { getLogger } from '@magickml/core' // Added getAgent import here

export type { Slack }

export interface SlackServiceOptions {
  app: Application
}

export type SlackParams = Params

export interface ExtendedSlackParams extends Params {
  agentId?: string
}

export interface SlackResponse {
  result: Object
}

export interface SlackError {
  error: string
}

const getAgent = async (
  agentId: string,
  slackAppId: string,
  slackVerificationToken: string
): Promise<Agent> => {
  const agent = await app.service('agents').get(agentId)
  if (!agent) {
    throw new NotFound('Agent not found with id ' + agentId)
  }

  if (!agent.data.slack_enabled) {
    throw new BadRequest('Agent does not have Slack enabled')
  }

  if (slackAppId !== agent.data.slack_app_id) {
    throw new Error('Invalid Slack app id')
  }

  if (slackVerificationToken !== agent.data.slack_verification_token) {
    throw new Error('Invalid Slack verification token')
  }

  return agent as unknown as Agent
}

export class SlackService<
  ServiceParams extends ExtendedSlackParams = ExtendedSlackParams
> implements ServiceInterface<SlackResponse | SlackError, Slack, ServiceParams>
{
  logger: pino.Logger = getLogger()

  async create(
    data: Slack,
    params: ServiceParams
  ): Promise<SlackResponse | SlackError> {
    const agentId = params.agentId
    if (!agentId) {
      throw new GeneralError('Missing agentId')
    }

    const slackAppId = data.api_app_id
    const slackVerificationToken = data.token

    const agent = await getAgent(agentId, slackAppId, slackVerificationToken)

    // const content = data.event.text
    console.log('data', data)

    return {
      result: {
        message: 'Hello world',
      },
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
