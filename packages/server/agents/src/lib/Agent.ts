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
  AGENT_RUN_ERROR,
  AGENT_LOG,
  AGENT_RUN_JOB,
  MagickSpellOutput,
  type Event,
  SpellInterface,
} from 'shared/core'
import { PING_AGENT_TIME_MSEC } from 'shared/config'

import { AgentManager } from './AgentManager'
import {
  type Job,
  type Worker,
  type PubSub,
  BullQueue,
  MessageQueue,
  Application,
} from 'server/core'
import { AgentEvents, EventMetadata } from 'server/event-tracker'
import { CommandHub } from './CommandHub'
import { checkPaginated } from 'shared/utils'

/**
 * The Agent class that implements AgentInterface.
 */
export class Agent implements AgentInterface {
  name = ''
  id: any
  secrets: any
  publicVariables!: Record<string, string>
  data!: AgentInterface
  spellManager: SpellManager
  projectId!: string
  rootSpellId!: string
  agentManager: AgentManager
  spellRunner?: SpellRunner
  logger: pino.Logger = getLogger()
  worker: Worker
  messageQueue: MessageQueue
  commandHub: CommandHub
  pubsub: PubSub
  ready = false
  app: Application

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
    app: Application
  ) {
    this.id = agentData.id
    this.agentManager = agentManager
    this.app = app

    this.update(agentData)
    this.logger.info('Creating new agent named: %s | %s', this.name, this.id)

    // Set up the agent worker to handle incoming messages
    this.worker = worker
    this.worker.initialize(AGENT_RUN_JOB(this.id), this.runWorker.bind(this))

    this.messageQueue = new BullQueue()
    this.messageQueue.initialize(AGENT_RUN_JOB(this.id))
    this.pubsub = pubsub

    this.commandHub = new CommandHub(this, this.pubsub)

    this.spellManager = new SpellManager({
      cache: false,
      agent: this,
      app,
    })
    ;(async () => {
      // initialize the plugins
      await this.initializePlugins()

      // initialize the plugin commands
      this.initializePluginCommands()

      // initialize the core commands
      // These are used to remotely control the agent
      this.initializeCoreCommands()

      this.logger.info('New agent created: %s | %s', this.name, this.id)
      this.ready = true
    })()
  }

  /**
   * Updates the agent's data.
   * @param data {AgentData} - The new data.
   */
  update(data: AgentInterface) {
    this.data = data
    this.secrets = data?.secrets ? JSON.parse(data?.secrets) : {}
    this.publicVariables = data.publicVariables
    this.name = data.name ?? 'agent'
    this.projectId = data.projectId
    this.rootSpellId = data.rootSpellId as string
    this.logger.info('Updated agent: %s | %s', this.name, this.id)
  }
  /*
   * Initializes the plugins for the Agent.
   * If no root spell is found, logs a warning and returns.
   * Loads the root spell and sets the spellRunner.
   * Runs the agent start methods that were loaded from plugins.
   * Sets the outputTypes for the Agent.
   */
  private async initializePlugins() {
    if (!this.data.rootSpellId) {
      this.logger.warn('No root spell found for agent: %o', {
        id: this.id,
        name: this.name,
      })
      return
    }
    const spell = checkPaginated<SpellInterface>(
      await this.app.service('spells').find({
        query: {
          projectId: this.data.projectId,
          id: this.data.rootSpellId,
        },
      })
    ).data[0]

    this.spellRunner = await this.spellManager.load(spell)

    const agentStartMethods = pluginManager.getAgentStartMethods()

    this.logger.debug('Initializing plugins on agent %s', this.id)

    // Runs the agent start methods that were loaded from plugins
    for (const method of Object.keys(agentStartMethods)) {
      try {
        await agentStartMethods[method]({
          agentManager: this.agentManager,
          agent: this,
          spellRunner: this.spellRunner,
        })
      } catch (err) {
        this.error('Error in agent start method', { method, err })
      }
    }

    const outputTypes = pluginManager.getOutputTypes()
    this.outputTypes = outputTypes
  }

  private initializePluginCommands() {
    const pluginCommands = pluginManager.getAgentCommands()
    for (const pluginName of Object.keys(pluginCommands)) {
      this.commandHub.registerPlugin(pluginName, pluginCommands[pluginName])
    }
  }

  /**
   * Initializes the core commands for the agent.
   * Registers the 'toggleLive' command with the command hub.
   *
   * @returns void
   */

  private initializeCoreCommands() {
    this.commandHub.registerDomain('agent', 'core', {
      toggleLive: async (data: any) => {
        this.spellManager.toggleLive(data)
      },
    })
  }

  removePlugins() {
    this.logger.debug('Removing all plugins on agent %s', this.id)
    const agentStopMethods = pluginManager.getAgentStopMethods()
    if (agentStopMethods)
      for (const method of Object.keys(agentStopMethods)) {
        agentStopMethods[method]({
          agentManager: this.agentManager,
          agent: this,
          spellRunner: this.spellRunner,
        })
      }
  }

  /**
   * Clean up resources when the instance is destroyed.
   */
  async onDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    this.removePlugins()
    this.log('destroyed agent', { id: this.id })
  }

  trackEvent(
    eventName: AgentEvents,
    metadata: EventMetadata = {},
    event: Event
  ) {
    // remove unwanted data
    delete event.content
    delete event.embedding
    delete event.rawData
    delete event.entities

    metadata.event = event

    this.app.get('posthog').track(eventName, metadata, this.id)
  }

  // published an event to the agents event stream
  publishEvent(event, message) {
    this.logger.trace('AGENT: publishing event %s', event)
    this.pubsub.publish(event, {
      ...message,
      // make sure all events include the agent and project id
      agentId: this.id,
      projectId: this.projectId,
    })
  }

  // sends a log event along the event stream
  log(message, data = {}) {
    this.logger.info(`${message} ${JSON.stringify(data)}`)
    this.publishEvent(AGENT_LOG(this.id), {
      agentId: this.id,
      projectId: this.projectId,
      type: 'log',
      message,
      data,
    })
  }

  warn(message, data = {}) {
    this.logger.warn(`${message} ${JSON.stringify(data)}`)
    this.publishEvent(AGENT_LOG(this.id), {
      agentId: this.id,
      projectId: this.projectId,
      type: 'warn',
      message,
      data,
    })
  }

  error(message, data = {}) {
    this.logger.error(`${message} %o`, { error: data })
    this.publishEvent(AGENT_LOG(this.id), {
      agentId: this.id,
      projectId: this.projectId,
      type: 'error',
      message,
      data: { error: data },
    })
  }

  async runWorker(job: Job<AgentRunJob>) {
    // the job name is the agent id.  Only run if the agent id matches.
    this.logger.debug({ id: this.id, data: job.data }, 'running worker')
    if (this.id !== job.data.agentId) return

    const { data } = job

    const spellRunner = await this.spellManager.loadById(
      data.spellId || this.rootSpellId
    )

    // Handle the case where we don't get a sepllRunner
    if (!spellRunner) {
      this.logger.error(
        { spellId: data.spellId, agent: { name: this.name, id: this.id } },
        'Spell not found'
      )
      this.publishEvent(AGENT_RUN_ERROR(this.id), {
        jobId: job.data.jobId,
        agentId: this.id,
        projectId: this.projectId,
        originalData: data,
        result: { error: 'Spell not found' },
      })
      return
    }

    try {
      this.logger.debug(
        { spellId: data.spellId, agent: { name: this.name, id: this.id } },
        "Running agent's spell"
      )
      const output = await spellRunner.runComponent({
        ...data,
        agent: this,
        secrets: {
          ...this.secrets,
          ...data.secrets,
        },
        sessionId: data?.sessionId,
        publicVariables: this.publicVariables,
        runSubspell: data.runSubspell,
        app: this.app,
        isPlaytest: data.isPlaytest,
      })

      this.publishEvent(AGENT_RUN_RESULT(this.id), {
        jobId: job.data.jobId,
        agentId: this.id,
        projectId: this.projectId,
        originalData: data,
        result: output,
      })
    } catch (err) {
      console.log('ERROR', err)
      this.logger.error(
        { spellId: data.spellId, agent: { name: this.name, id: this.id } },
        'Error running agent spell: %o',
        err
      )

      this.publishEvent(AGENT_RUN_ERROR(this.id), {
        jobId: job.data.jobId,
        agentId: this.id,
        projectId: this.projectId,
        originalData: data,
        result: {
          error: err instanceof Error ? err.message : 'Error running agent',
        },
      })
    }
  }
}

export interface AgentRunJob {
  inputs: MagickSpellInput
  sessionId?: string
  jobId: string
  agentId: string
  spellId: string
  componentName: string
  runSubspell: boolean
  secrets: Record<string, string>
  publicVariables: Record<string, unknown>
  isPlaytest?: boolean
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
