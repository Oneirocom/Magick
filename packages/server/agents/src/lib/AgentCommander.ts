import EventEmitter from 'events'
import { Agent } from './Agent'
import { type PubSub, type Job } from 'server/communication'
import {
  AGENT_RUN_JOB,
  AGENT_RUN_ERROR,
  AGENT_RUN_RESULT,
  AGENT_DELETE,
  AGENT_COMMAND,
  AGENT_COMMAND_PROJECT,
  AGENT_MESSAGE,
} from 'shared/core'
import { getLogger } from 'server/logger'
import type { MagickSpellInput } from 'shared/core'
import { v4 as uuidv4 } from 'uuid'
import type pino from 'pino'
import { AgentResult, AgentRunJob } from './Agent'
import { AGENT_RESPONSE_TIMEOUT_MSEC } from 'shared/config'

export type RunRootSpellArgs = {
  agent?: Agent
  agentId: string
  inputs: MagickSpellInput
  componentName?: string
  runSubspell?: boolean
  secrets?: Record<string, string>
  publicVariables?: Record<string, unknown>
  spellId: string
  isSubSpell?: boolean
  currentJob?: Job<AgentRunJob>
  subSpellDepth?: number
  sessionId?: string
  isPlaytest?: boolean
  version?: string
}

export interface AgentCommandData {
  agentId?: string
  projectId?: string
  command: string
  data: Record<string, any>
}

interface AgentCommanderArgs {
  pubSub: PubSub
}

export class AgentCommander extends EventEmitter {
  pubSub: PubSub
  logger: pino.Logger = getLogger()

  constructor({ pubSub }: AgentCommanderArgs) {
    super()
    this.pubSub = pubSub
  }

  runSpellWithResponse(args: RunRootSpellArgs) {
    const { agentId, agent } = args
    const id = agentId || agent?.id
    if (!id) throw new Error('Agent or agent id is required')

    return new Promise((resolve, reject) => {
      ;(async () => {
        setTimeout(() => {
          reject(new Error('Timeout'))
        }, AGENT_RESPONSE_TIMEOUT_MSEC)

        let jobId: null | string = null

        const agentMessageName = AGENT_RUN_RESULT(id)

        this.pubSub.subscribe(agentMessageName, (data: AgentResult) => {
          if (data.result.error) {
            this.logger.error(data.result.error)
            throw new Error(
              `Error running spell on agent: ${data.result.error}`
            )
          }

          if (data.jobId === jobId) {
            this.pubSub.unsubscribe(agentMessageName)
            resolve(data.result)
          }
        })

        const agentErrorName = AGENT_RUN_ERROR(id)
        this.pubSub.subscribe(agentErrorName, (data: AgentResult) => {
          if (data.jobId === jobId) {
            this.pubSub.unsubscribe(agentErrorName)
            this.pubSub.unsubscribe(agentMessageName)
            reject(`Error running spell on agent: ${data.result.error}`)
          }
        })

        jobId = await this.runSpell(args)
      })()
    })
  }

  private runRootSpellArgsToString(
    jobId: string,
    {
      agentId,
      inputs,
      componentName,
      runSubspell,
      secrets,
      publicVariables,
      spellId,
      subSpellDepth,
      sessionId,
      isPlaytest = false,
      version = 'v1',
    }: RunRootSpellArgs
  ) {
    return JSON.stringify({
      jobId,
      agentId,
      spellId: spellId,
      inputs,
      componentName,
      runSubspell,
      secrets,
      publicVariables,
      subSpellDepth,
      sessionId,
      isPlaytest,
      version,
    })
  }

  async runSubSpell(args: RunRootSpellArgs) {
    const { agentId, agent } = args
    const id = agentId || agent?.id

    if (!id) throw new Error('Agent or agent id is required')

    // Make sure agent ID is set
    args.agentId = id

    const spellId = args.spellId || args?.agent?.rootSpellId
    if (!spellId) throw new Error('Spell ID or agent is required')

    // Make sure spell ID is set
    args.spellId = spellId

    const jobId = uuidv4()
    await this.pubSub.publish(
      AGENT_RUN_JOB(id),
      this.runRootSpellArgsToString(jobId, args)
    )
    return jobId
  }

  async runSpell(args: RunRootSpellArgs) {
    const { agent, agentId } = args
    const id = agentId || agent?.id
    if (!id) throw new Error('Agent or agent id is required')

    // Make sure agent ID is set
    args.agentId = id

    //spellID is required
    const spellId = args.spellId || args?.agent?.rootSpellId
    if (!spellId) throw new Error('Spell ID or agent is required')

    // Make sure spell ID is set
    args.spellId = spellId

    this.logger.debug(`Running Spell on Agent: ${id}`)
    this.logger.debug(AGENT_RUN_JOB(id))
    this.logger.debug(
      JSON.parse(this.runRootSpellArgsToString(uuidv4(), args)),
      'Sending root spell args'
    )
    const jobId = uuidv4()
    await this.pubSub.publish(
      AGENT_RUN_JOB(id),
      this.runRootSpellArgsToString(jobId, args)
    )
    return jobId
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

    if (!event) throw new Error('Agent ID or project ID is required')

    this.logger.debug(
      `AgentCommander sending event ${event} to agent ${agentId} with data ${JSON.stringify(
        data
      )}`
    )

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

  async removeAgent(agentId: string) {
    this.pubSub.publish(AGENT_DELETE, agentId)
  }
}
