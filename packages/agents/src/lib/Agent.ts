// DOCUMENTED
import pino from 'pino'
import {
  SpellManager,
  SpellRunner,
  pluginManager,
  AgentInterface,
  getLogger,
  MagickSpellInput,
  AGENT_RUN_RESULT,
  AGENT_LOG,
  AGENT_WARN,
  AGENT_ERROR,
  AGENT_RUN_JOB,
  MagickSpellOutput,
} from '@magickml/core'
import { PING_AGENT_TIME_MSEC } from '@magickml/config'

import { AgentManager } from './AgentManager'
import { app, type Job, type Worker, type PubSub, BullQueue, MessageQueue } from '@magickml/server-core'

/**
 * The Agent class that implements AgentInterface.
 */
export class Agent implements AgentInterface {
  name = ''
  id: any
  secrets: any
  publicVariables: Record<string, string>
  data: AgentInterface
  spellManager: SpellManager
  projectId: string
  rootSpellId: string
  agentManager: AgentManager
  spellRunner?: SpellRunner
  logger: pino.Logger = getLogger()
  worker: Worker
  messageQueue: MessageQueue
  pubsub: PubSub
  ready = false

  outputTypes: any[] = []
  updateInterval: any

  /**
   * Agent constructor initializes properties and sets intervals for updating agents
   * @param agentData {AgentData} - The instance's data.
   * @param agentManager {AgentManager} - The instance's manager.
   */
  constructor(
    agentData: AgentInterface,
    agentManager: AgentManager,
    worker: Worker,
    pubsub: PubSub,
  ) {
    this.secrets = agentData?.secrets ? JSON.parse(agentData?.secrets) : {}
    this.publicVariables = agentData.publicVariables
    this.id = agentData.id
    this.data = agentData
    this.agentManager = agentManager
    this.name = agentData.name ?? 'agent'
    this.projectId = agentData.projectId
    this.rootSpellId = agentData.rootSpellId

    this.logger.info('Creating new agent named: %s | %s', this.name, this.id)

    // Set up the agent worker to handle incoming messages
    this.worker = worker
    this.worker.initialize(AGENT_RUN_JOB(this.id), this.runWorker.bind(this))

    this.messageQueue = new BullQueue()
    this.messageQueue.initialize(AGENT_RUN_JOB(this.id))

    this.pubsub = pubsub

    const spellManager = new SpellManager({
      cache: false,
      agent: this,
      app,
    })

    this.spellManager = spellManager
    ;(async () => {
      if (!agentData.rootSpellId) {
        this.logger.warn('No root spell found for agent: %o', {
          id: this.id,
          name: this.name,
        })
        return
      }
      const spell = (
        await app.service('spells').find({
          query: {
            projectId: agentData.projectId,
            id: agentData.rootSpellId,
          },
        })
      ).data[0]

      this.spellRunner = await spellManager.load(spell)

      const agentStartMethods = pluginManager.getAgentStartMethods()

      // Runs the agent start methods that were loaded from plugins
      for (const method of Object.keys(agentStartMethods)) {
        try {
          await agentStartMethods[method]({
            agentManager,
            agent: this,
            spellRunner: this.spellRunner,
          })
        } catch (err) {
          this.error('Error in agent start method', { method, err })
        }
      }

      const outputTypes = pluginManager.getOutputTypes()
      this.outputTypes = outputTypes

      this.updateInterval = setInterval(async () => {
        // every second, update the agent, set pingedAt to now
        try {
          await app.service('agents').patch(this.id, {
            pingedAt: new Date().toISOString(),
          })
        } catch(err) {
          if (err.name === 'NotFound') {
            this.logger.warn('Agent not found: %s', this.id)
            app.get('agentCommander').removeAgent(this.id)
            clearInterval(this.updateInterval)
          }
        }
      }, PING_AGENT_TIME_MSEC)
      this.logger.info('New agent created: %s | %s', this.name, this.id)
      this.ready = true
    })()
  }

  /**
   * Clean up resources when the instance is destroyed.
   */
  async onDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    const agentStopMethods = pluginManager.getAgentStopMethods()
    if (agentStopMethods)
      for (const method of Object.keys(agentStopMethods)) {
        agentStopMethods[method]({
          agentManager: this.agentManager,
          agent: this,
          spellRunner: this.spellRunner,
        })
      }
    this.log('destroyed agent', { id: this.id })
  }

  // published an event to the agents event stream
  publishEvent(event, message) {
    this.pubsub.publish(event, {
      ...message,
      // make sure all events include the agent and project id
      agentId: this.id,
      projectId: this.projectId,
    })
  }

  // sends a log event along the event stream
  log(message, data) {
    this.logger.info(`${message} ${JSON.stringify(data)}`)
    this.publishEvent(AGENT_LOG(this.id), {
      agentId: this.id,
      projectId: this.projectId,
      type: 'log',
      message,
      data,
    })
  }

  warn(message, data) {
    this.logger.warn(`${message} ${JSON.stringify(data)}`)
    this.publishEvent(AGENT_WARN(this.id), {
      agentId: this.id,
      projectId: this.projectId,
      type: 'warn',
      message,
      data,
    })
  }

  error(message, data = {}) {
    this.logger.error(`${message} %o`, { error: data })
    this.publishEvent(AGENT_ERROR(this.id), {
      agentId: this.id,
      projectId: this.projectId,
      type: 'error',
      message,
      data: { error: data },
    })
  }

  async runWorker(job: Job<AgentRunJob>) {
    // the job name is the agent id.  Only run if the agent id matches.
    if (this.id !== job.data.agentId) return

    const { data } = job

    const spellRunner = await this.spellManager.loadById(data.spellId)

    // Do we want a debug logger here?
    const output = await spellRunner.runComponent({
      ...data,
      agent: this,
      secrets: this.secrets,
      publicVariables: this.publicVariables,
      runSubspell: true,
      app,
    })

    this.publishEvent(AGENT_RUN_RESULT(this.id), {
      jobId: job.data.jobId,
      agentId: this.id,
      projectId: this.projectId,
      originalData: data,
      result: output,
    })
  }
}

export interface AgentRunJob {
  inputs: MagickSpellInput
  jobId: string
  agentId: string
  spellId: string
  componentName: string
  runSubspell: boolean
  secrets: Record<string, string>
  publicVariables: Record<string, unknown>
}

export interface AgentResult {
  jobId: string
  agentId: string
  projectId: string
  originalData: AgentRunJob
  result: MagickSpellOutput
}


export interface AgentUpdateJob {
  agentId: string
}

export type AgentJob = AgentRunJob | AgentUpdateJob

// Exporting Agent class as default
export default Agent
