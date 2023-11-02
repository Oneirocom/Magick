import EventEmitter from 'events'
import type { Agent } from '@magickml/agents'
import { type PubSub, type Job } from '@magickml/server-core'
import {
  AGENT_RUN_JOB,
  AGENT_RUN_ERROR,
  AGENT_RUN_RESULT,
  AGENT_DELETE,
  getLogger,
} from '@magickml/core'
import type { MagickSpellInput } from '@magickml/core'
import { v4 as uuidv4 } from 'uuid'
import type pino from 'pino'
import { AgentResult, AgentRunJob } from './Agent'
import { AGENT_RESPONSE_TIMEOUT_MSEC } from '@magickml/config'

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
    const { agent } = args
    return new Promise((resolve, reject) => {
      ;(async () => {
        setTimeout(() => {
          reject(new Error('Timeout'))
        }, AGENT_RESPONSE_TIMEOUT_MSEC)

        let jobId: null | string = null

        const agentMessageName = AGENT_RUN_RESULT(agent.id)

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

        const agentErrorName = AGENT_RUN_ERROR(agent.id)
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
      agent,
      inputs,
      componentName,
      runSubspell,
      secrets,
      publicVariables,
      spellId,
      subSpellDepth,
    }: RunRootSpellArgs
  ) {
    return JSON.stringify({
      jobId,
      agentId: agent.id,
      spellId: spellId || agent.rootSpellId,
      inputs,
      componentName,
      runSubspell,
      secrets,
      publicVariables,
      subSpellDepth,
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
      AGENT_RUN_JOB(agent.id),
      this.runRootSpellArgsToString(jobId, args)
    )
    return jobId
  }

  async removeAgent(agentId: string) {
    this.pubSub.emit(AGENT_DELETE, agentId)
  }
}
