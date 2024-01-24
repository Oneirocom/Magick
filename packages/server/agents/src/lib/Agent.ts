import pino from 'pino'
import {
  SpellManager,
  SpellRunner,
  pluginManager as v1PluginManager,
  MagickSpellInput,
  AGENT_RUN_RESULT,
  AGENT_RUN_ERROR,
  AGENT_LOG,
  AGENT_RUN_JOB,
  MagickSpellOutput,
  type Event,
  AGENT_ERROR,
  AGENT_WARN,
} from 'shared/core'

import { getLogger } from 'server/logger'

import { Application } from 'server/core'

import {
  type Job,
  type Worker,
  type MessageQueue,
  BullQueue,
} from 'server/communication'
import { AgentEvents, EventMetadata } from 'server/event-tracker'
import { CommandHub } from './CommandHub'
import { Spellbook } from 'server/grimoire'
import { AgentInterface } from 'server/schemas'
import { RedisPubSub } from 'server/redis-pubsub'
import { CloudAgentWorker } from 'server/cloud-agent-worker'
import { PluginManager } from 'server/pluginManager'
// import { StateService } from './StateService'

// type AgentData = {
//   state: {

//   }

/**
 * The Agent class that implements AgentInterface.
 */
export class Agent implements AgentInterface {
  name = ''
  id: any
  secrets: any
  publicVariables!: Record<string, string>
  currentSpellReleaseId: string | null = null
  data!: AgentInterface
  spellManager: SpellManager
  projectId!: string
  rootSpellId!: string
  spellRunner?: SpellRunner
  logger: pino.Logger = getLogger()
  worker: Worker
  messageQueue: MessageQueue
  commandHub: CommandHub
  pubsub: RedisPubSub
  ready = false
  app: Application
  // stateService: StateService
  spellbook: Spellbook<Agent, Application>
  agentManager: CloudAgentWorker
  pluginManager: PluginManager

  outputTypes: any[] = []

  /**
   * Agent constructor initializes properties and sets intervals for updating agents
   * @param agentData {AgentData} - The instance's data.
   * @param agentManager {AgentManager} - The instance's manager.
   */
  constructor(
    agentData: AgentInterface,
    agentManager: CloudAgentWorker,
    worker: Worker,
    pubsub: RedisPubSub,
    app: Application
  ) {
    this.id = agentData.id
    this.app = app
    this.agentManager = agentManager

    this.update(agentData)
    this.logger.info('Creating new agent named: %s | %s', this.name, this.id)

    // Set up the agent worker to handle incoming messages
    this.worker = worker
    this.worker.initialize(AGENT_RUN_JOB(this.id), this.runWorker.bind(this))

    this.messageQueue = new BullQueue(this.app.get('redis'))
    this.messageQueue.initialize(AGENT_RUN_JOB(this.id))
    this.pubsub = pubsub

    this.commandHub = new CommandHub(this, this.pubsub)

    this.spellManager = new SpellManager({
      cache: false,
      agent: this,
      app,
    })

    this.pluginManager = new PluginManager({
      pluginDirectory: process.env.PLUGIN_DIRECTORY || './plugins',
      connection: this.app.get('redis'),
      agentId: this.id,
      pubSub: this.app.get('pubsub'),
      projectId: this.projectId,
    })

    this.spellbook = new Spellbook({
      agent: this,
      app,
      pluginManager: this.pluginManager,
    })
    // initialize the plugins
    this.initializeV1Plugins()

    // initialize the plugin commands
    this.initializeV1PluginCommands()

    // initialize the core commands
    // These are used to remotely control the agent
    this.initializeCoreCommands()

    this.initializeSpellbook()

    // initialize the plugin commands
    this.intializePluginCommands()

    this.logger.info('New agent created: %s | %s', this.name, this.id)
    this.ready = true
  }

  /**
   * Updates the agent's data.
   * @param data {AgentData} - The new data.
   */
  update(data: AgentInterface) {
    this.data = data
    this.currentSpellReleaseId = data.currentSpellReleaseId || null
    this.secrets = data?.secrets ? JSON.parse(data?.secrets) : {}
    this.publicVariables = data.publicVariables
    this.name = data.name ?? 'agent'
    this.projectId = data.projectId
    this.rootSpellId = data.rootSpellId as string
    this.logger.info('Updated agent: %s | %s', this.name, this.id)
  }

  async updateData(data: Record<string, any>) {
    this.data = {
      ...this.data,
      ...data,
    }
    await this.app.service('agents').patch(this.id, data)
  }

  private async initializeSpellbook() {
    this.logger.debug(
      `Initializing spellbook for agent ${this.id} with version ${
        this.currentSpellReleaseId || 'draft-agent'
      }`
    )
    const spellsData = await this.app.service('spells').find({
      query: {
        projectId: this.projectId,
        type: 'behave',
        spellReleaseId: this.currentSpellReleaseId || 'null',
      },
    })
    if (!spellsData.data.length) {
      this.error(`No spells found for agent ${this.id} to load into spellbook.`)
      return
    }

    const spells = spellsData.data
    this.spellbook.loadSpells(spells)
  }

  /*
   * Initializes the plugins for the Agent.
   * If no root spell is found, logs a warning and returns.
   * Loads the root spell and sets the spellRunner.
   * Runs the agent start methods that were loaded from plugins.
   * Sets the outputTypes for the Agent.
   */
  private async initializeV1Plugins() {
    if (!this.data.rootSpellId) {
      this.logger.warn('No root spell found for agent: %o', {
        id: this.id,
        name: this.name,
      })
      return
    }
    const spell = (
      await this.app.service('spells').find({
        query: {
          projectId: this.data.projectId,
          id: this.data.rootSpellId,
        },
      })
    ).data[0]

    this.spellRunner = await this.spellManager.load(spell)

    const agentStartMethods = v1PluginManager.getAgentStartMethods()

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

    const outputTypes = v1PluginManager.getOutputTypes()
    this.outputTypes = outputTypes
  }

  private initializeV1PluginCommands() {
    const pluginCommands = v1PluginManager.getAgentCommands()
    for (const pluginName of Object.keys(pluginCommands)) {
      this.commandHub.registerPlugin(pluginName, pluginCommands[pluginName])
    }
  }

  private intializePluginCommands() {
    const plugins = this.pluginManager.getPlugins()
    for (const plugin of plugins) {
      this.commandHub.registerPlugin(plugin.name, plugin.getCommands())
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
        this.spellbook.toggleLive(data)
      },
      pauseSpell: async (data: any) => {
        this.spellbook.pauseSpell(data)
      },
      playSpell: async (data: any) => {
        this.spellbook.playSpell(data)
      },
    })
  }

  async removePlugins() {
    this.logger.debug('Removing all plugins on agent %s', this.id)
    const agentStopMethods = v1PluginManager.getAgentStopMethods()
    if (agentStopMethods)
      for (const method of Object.keys(agentStopMethods)) {
        await agentStopMethods[method]({
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
    await this.removePlugins()
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
    // this.logger.trace('AGENT: publishing event %s', event)
    this.pubsub.publish(event, {
      ...message,
      // make sure all events include the agent and project id
      agentId: this.id,
      projectId: this.projectId,
    })
  }

  // sends a log event along the event stream
  log(message, data = {}) {
    this.logger.info(data, `${message} ${JSON.stringify(data)}`)
    this.publishEvent(AGENT_LOG(this.id), {
      agentId: this.id,
      projectId: this.projectId,
      type: 'log',
      message,
      data,
    })
  }

  warn(message, data = {}) {
    this.logger.warn(data, `${message} ${JSON.stringify(data)}`)
    this.publishEvent(AGENT_WARN(this.id), {
      agentId: this.id,
      projectId: this.projectId,
      type: 'warn',
      message,
      data,
    })
  }

  error(message, data = {}) {
    this.logger.error(data, `${message}`)
    this.publishEvent(AGENT_ERROR(this.id), {
      agentId: this.id,
      projectId: this.projectId,
      type: 'error',
      message,
      data,
    })
  }

  async runV1Job(job: Job<AgentRunJob>) {
    this.logger.debug('Running V1 Job')
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

  runV2Job(job: Job<AgentRunJob>) {
    this.logger.debug('Running V2 Job!!!')
    const { data } = job

    try {
      this.logger.debug(
        { spellId: data.spellId, agent: { name: this.name, id: this.id } },
        "Running agent's behave graph spell in spellbook"
      )

      // this.spellbook.
    } catch (err) {
      this.logger.error(
        { spellId: data.spellId, agent: { name: this.name, id: this.id }, err },
        'Error running agent spell'
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

  async runWorker(job: Job<AgentRunJob>) {
    // the job name is the agent id.  Only run if the agent id matches.
    this.logger.debug({ id: this.id, data: job.data }, 'running worker')
    if (this.id !== job.data.agentId) return

    if (job.data.version === 'v1') this.runV1Job(job)
    if (job.data.version === 'v2') this.runV2Job(job)
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
  version: string
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
