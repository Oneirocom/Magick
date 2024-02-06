import pino from 'pino'
import { type Event } from 'shared/core'

import { AGENT_ERROR, AGENT_WARN, AGENT_PONG, AGENT_LOG } from 'communication'

import { type Worker } from 'server/communication'
import { Application } from 'server/core'
import { getLogger } from 'server/logger'
import { AgentEvents, EventMetadata } from 'server/event-tracker'
import { Spellbook } from 'server/grimoire'
import { AgentInterface } from 'server/schemas'
import { RedisPubSub } from 'server/redis-pubsub'
import { CloudAgentWorker } from 'server/cloud-agent-worker'
import { PluginManager } from 'server/pluginManager'
import { CommandHub } from 'server/command-hub'
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
  projectId!: string
  rootSpellId!: string
  logger: pino.Logger = getLogger()
  worker: Worker
  commandHub: CommandHub
  version!: string
  pubsub: RedisPubSub
  ready = false
  app: Application
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

    this.pubsub = pubsub

    this.commandHub = new CommandHub(this, this.pubsub)

    this.pluginManager = new PluginManager({
      pluginDirectory: process.env.PLUGIN_DIRECTORY || './plugins',
      connection: this.app.get('redis'),
      agentId: this.id,
      pubSub: this.app.get('pubsub'),
      projectId: this.projectId,
    })

    // @ts-ignore
    this.spellbook = new Spellbook({
      agent: this,
      app,
      pluginManager: this.pluginManager,
      commandHub: this.commandHub,
    })
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
    this.version = data.version
    this.currentSpellReleaseId = data.currentSpellReleaseId || null
    this.secrets = data?.secrets ? JSON.parse(data?.secrets) : {}
    this.publicVariables = data.publicVariables
    this.name = data.name ?? 'agent'
    this.projectId = data.projectId
    this.logger.info('Updated agent: %s | %s', this.name, this.id)
  }

  // async updateData(data: Record<string, any>) {
  //   this.data = {
  //     ...this.data,
  //     ...data,
  //   }
  //   await this.app.service('agents').patch(this.id, data)
  // }

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
      ping: async () => {
        const isLive = this.spellbook.isLive
        this.pubsub.publish(AGENT_PONG(this.id), {
          agentId: this.id,
          projectId: this.projectId,
          isLive,
        })
      },
    })
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

  /**
   * Clean up resources when the instance is destroyed.
   */
  async onDestroy() {
    await this.spellbook.onDestroy()
    await this.pluginManager.onDestroy()
    await this.worker.close()
    await this.commandHub.onDestroy()

    this.log('destroyed agent', { id: this.id })
  }
}

export interface AgentUpdateJob {
  agentId: string
}

export type AgentJob = AgentUpdateJob

// Exporting Agent class as default
export default Agent
