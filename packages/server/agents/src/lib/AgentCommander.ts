import EventEmitter from 'events'
import {
  AGENT_DELETE,
  AGENT_COMMAND,
  AGENT_COMMAND_PROJECT,
  AGENT_MESSAGE,
} from 'communication'
import { getLogger } from 'server/logger'
import { v4 as uuidv4 } from 'uuid'
import type pino from 'pino'
import { EventPayload } from 'server/plugin'
import { RedisPubSub } from 'server/redis-pubsub'

export interface AgentCommandData {
  agentId?: string
  projectId?: string
  command: string
  data: Record<string, any>
}

interface AgentCommanderArgs {
  pubSub: RedisPubSub
}

export class AgentCommander extends EventEmitter {
  pubSub: RedisPubSub
  logger: pino.Logger = getLogger()

  constructor({ pubSub }: AgentCommanderArgs) {
    super()
    this.pubSub = pubSub
  }
  /**
   * Sends a command to an agent or project for execution.
   * @param args - An object containing the agent ID, project ID, command, and data.
   * @returns A unique job ID for the command.
   * @throws An error if agentId or projectId is missing.
   */
  async command(args: AgentCommandData) {
    const { agentId, command, data, projectId } = args

    const event = agentId
      ? AGENT_COMMAND(agentId)
      : projectId
      ? AGENT_COMMAND_PROJECT(projectId)
      : null

    if (!event) {
      console.error('agentId or projectId is required', args)
      return null
    }

    this.logger.debug(`Sending command ${command} to agent ${agentId}`)

    const jobId = uuidv4()
    await this.pubSub.publish(
      event,
      JSON.stringify({
        jobId,
        agentId,
        command,
        data,
      })
    )
    return jobId
  }

  message(agentId: string, data: EventPayload) {
    const eventPayload: EventPayload = {
      ...data,
    }

    this.logger.debug(
      data,
      `Sending message ${AGENT_MESSAGE(agentId)} to agent ${agentId} `
    )
    this.pubSub.publish(AGENT_MESSAGE(agentId), eventPayload)
  }

  ping(agentId: string) {
    this.command({
      agentId,
      command: `agent:core:ping`,
      data: {},
    })
  }

  syncState(agentId: string) {
    this.command({
      agentId,
      command: `agent:spellbook:syncState`,
      data: {},
    })
  }

  async removeAgent(agentId: string) {
    this.pubSub.publish(AGENT_DELETE, agentId)
  }
}
