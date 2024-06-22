import pino from 'pino'
import {
  AGENT_ERROR,
  AGENT_WARN,
  AGENT_PONG,
  AGENT_LOG,
  AGENT_SERAPH_EVENT,
} from 'communication'
import type { Application } from 'server/core'
import { getLogger } from 'server/logger'
import { EventMetadata } from 'server/event-tracker'
import { AgentInterface, SpellInterface } from 'server/schemas'
import { RedisPubSub } from 'server/redis-pubsub'
import { PluginManager } from 'server/pluginManager'
import { CommandHub } from 'server/command-hub'
import { AGENT_HEARTBEAT_INTERVAL_MSEC } from 'shared/config'
import { ActionPayload, EventPayload, ISeraphEvent } from 'servicesShared'
import { SeraphManager } from '@magickml/seraph-manager'

import EventEmitter from 'events'
import TypedEmitter from 'typed-emitter'
import { Spellbook } from 'server/grimoire'
import { AgentLoggingService } from './AgentLogger'

import CorePlugin from 'plugins/core'
import KnowledgePlugin from '@magickml/plugin-knowledge'
import DiscordPlugin from 'plugins/discord'
import SlackPlugin from 'plugins/slack'
import { v4 } from 'uuid'

export type RequestPayload = {
  projectId: string
  agentId: string
  requestData: string
  responseData: string
  model: string
  status: string
  statusCode: number
  parameters: string
  provider: string
  type: string
  hidden: boolean
  processed: boolean
  spell: SpellInterface
  nodeId: number | null
  customModel?: string
  cost: number
}

export type GraphEventPayload = {
  sender: string
  agentId: string
  connector: string
  connectorData: string
  observer: string
  content: string
  eventType: string
  event: EventPayload
}

export type AgentEventPayload<
  Data = Record<string, unknown>,
  Y = Record<string, unknown>
> = Partial<
  Exclude<
    EventPayload<Data, Y>,
    'content' | 'sender' | 'eventName' | 'skipSave'
  >
> &
  Pick<EventPayload<Data, Y>, 'content' | 'sender' | 'eventName' | 'skipSave'>

type AgentEvents = {
  message: (event: EventPayload) => void
  messageReceived: (event: ActionPayload) => void
  messageStream: (event: ActionPayload) => void
  eventComplete: (event: EventPayload | null) => void
  error: (error: ActionPayload) => void
}

const plugins = [CorePlugin, KnowledgePlugin, DiscordPlugin, SlackPlugin]

/**
 * Agent class represents an agent instance.
 * It contains the agent's data, methods to update the agent, and methods to handle events.
 */
export class Agent
  extends (EventEmitter as new () => TypedEmitter<AgentEvents>)
  implements AgentInterface
{
  name = ''
  id: any
  secrets: any
  publicVariables!: Record<string, string>
  currentSpellReleaseId: string | null = null
  data!: AgentInterface
  projectId!: string
  logger: pino.Logger = getLogger()
  commandHub: CommandHub<this>
  version!: string
  pubsub: RedisPubSub
  app: any
  // app: Application
  spellbook: Spellbook<Application, this>
  pluginManager: PluginManager<this>
  private heartbeatInterval: NodeJS.Timer
  loggingService: AgentLoggingService<this>
  seraphManager: SeraphManager

  /**
   * Agent constructor initializes properties and sets intervals for updating agents
   * @param agentData {AgentData} - The instance's data.
   */
  constructor(
    agentData: AgentInterface,
    pubsub: RedisPubSub,
    app: Application
  ) {
    super()
    this.loggingService = new AgentLoggingService(this)
    this.id = agentData.id
    this.app = app

    this.update(agentData)
    this.logger.info('Creating new agent named: %s | %s', this.name, this.id)

    // Set up the agent worker to handle incoming messages

    this.pubsub = pubsub

    this.commandHub = new CommandHub<this>(this, this.pubsub)

    this.seraphManager = new SeraphManager({
      seraphOptions: {
        openAIApiKey: process.env.OPENAI_API_KEY || '',
        anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
      },
      agentId: this.id,
      projectId: this.projectId,
      pubSub: this.pubsub,
      commandHub: this.commandHub,
      app: this.app,
    })

    this.pluginManager = new PluginManager<this>({
      pluginDirectory: process.env.PLUGIN_DIRECTORY || './plugins',
      connection: this.app.get('redis'),
      agent: this,
      pubSub: this.app.get('pubsub'),
      projectId: this.projectId,
      commandHub: this.commandHub,
    })

    // @ts-ignore
    this.spellbook = new Spellbook({
      agent: this,
      app,
      pluginManager: this.pluginManager,
      commandHub: this.commandHub,
    })

    this.initialize()

    this.heartbeatInterval = this.startHeartbeat()

    this.logger.info('New agent created: %s | %s', this.name, this.id)
  }

  initialize() {
    // initialize the core commands
    // These are used to remotely control the agent
    this.initializeCoreCommands()

    this.pluginManager.loadRawPlugins(plugins)

    // initialzie spellbook
    this.initializeSpellbook()
  }

  formatEvent<Data = Record<string, unknown>, Y = Record<string, unknown>>(
    partialEvent: AgentEventPayload<Data, Y>
  ): EventPayload<Data, Y> {
    return {
      channel: 'agent',
      connector: 'agent',
      client: 'agent',
      agentId: this.id,
      observer: this.id,
      channelType: 'agent',
      rawData: '',
      timestamp: new Date().toISOString(),
      data: {} as Data,
      metadata: {} as Y,
      status: 'success',
      plugin: 'core',
      ...partialEvent,
    }
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
    this.logger.info('AGENT: Updated agent: %s | %s', this.name, this.id)
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
    const spellsData = await (this.app.service('spells') as any).find({
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
    await this.spellbook.loadSpells(spells)
  }

  startHeartbeat() {
    const redis = this.app.get('redis')
    const AGENT_ID = this.id
    const HEARTBEAT_KEY = `agent:heartbeat:${AGENT_ID}`

    return setInterval(() => {
      const timestamp = Date.now()
      redis.set(HEARTBEAT_KEY, timestamp.toString())
      // Optionally set an expiry longer than the heartbeat interval
      redis.expire(HEARTBEAT_KEY, 15) // Expires after 60 seconds
    }, AGENT_HEARTBEAT_INTERVAL_MSEC)
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
    eventName: any,
    metadata: EventMetadata = {},
    event: EventPayload
  ) {
    // remove unwanted data
    if (event?.hasOwnProperty('content')) {
      // @ts-ignore
      delete event?.content
    }
    if (event?.hasOwnProperty('rawData')) {
      // @ts-ignore
      delete event?.rawData
    }
    if (event?.hasOwnProperty('data')) {
      delete event?.data
    }

    metadata.event = event

    this.app.get('posthog').track(eventName, metadata, this.id)
  }

  // published an event to the agents event stream
  publishEvent(event: string, message: Record<string, any>) {
    // this.logger.trace('AGENT: publishing event %s', event)
    this.pubsub.publish(event, {
      ...message,
      // make sure all events include the agent and project id
      agentId: this.id,
      projectId: this.projectId,
    })
  }

  // sends a log event along the event stream
  log(message: string, data = {}) {
    this.logger.info(data, `${message} ${JSON.stringify(data)}`)
    this.publishEvent(AGENT_LOG(this.id), {
      agentId: this.id,
      projectId: this.projectId,
      type: 'log',
      message,
      data,
    })
  }

  warn(message: string, data = {}) {
    this.logger.warn(data, `${message} ${JSON.stringify(data)}`)
    this.publishEvent(AGENT_WARN(this.id), {
      agentId: this.id,
      projectId: this.projectId,
      type: 'warn',
      message,
      data,
    })
  }

  error(message: string, data = {}) {
    this.logger.error(data, `${message}`)
    this.publishEvent(AGENT_ERROR(this.id), {
      agentId: this.id,
      projectId: this.projectId,
      type: 'error',
      message,
      data,
    })
  }

  seraphEvent(event: ISeraphEvent) {
    this.logger.info('Processing seraph event: %o', event)
    this.publishEvent(AGENT_SERAPH_EVENT(this.id), { data: event })
  }

  /**
   * Clean up resources when the instance is destroyed.
   */
  async onDestroy() {
    await this.spellbook.onDestroy()
    await this.pluginManager.onDestroy()
    await this.commandHub.onDestroy()
    clearInterval(this.heartbeatInterval as any)

    this.log('destroyed agent', { id: this.id })
  }

  async saveRequest(request: RequestPayload) {
    // Calculate the request cost based on total tokens and model.
    // const cost =
    //   totalTokens !== undefined && totalTokens > 0
    //     ? calculateCompletionCost({
    //         totalTokens: totalTokens as number,
    //         model: model as any,
    //       })
    //     : 0

    // Calculate the request duration.
    const end = Date.now()
    const duration = end - Date.now()
    const spell = request.spell

    // Save and create the request object in Feathers app.
    return (this.app.service('request') as any).create({
      id: v4(),
      ...request,
      spell: typeof spell === 'string' ? spell : JSON.stringify(spell),
      duration,
    })
  }

  async saveGraphEvent(event: GraphEventPayload) {
    const {
      sender,
      agentId,
      connector,
      connectorData,
      observer,
      content,
      eventType,
    } = event

    if (!content) {
      return
    }

    this.app.get('posthog').track(eventType, event, agentId)

    return (this.app.service('graphEvents') as any).create({
      sender,
      agentId,
      connector,
      connectorData,
      content,
      observer,
      eventType,
      event,
    })
  }
}

export interface AgentUpdateJob {
  agentId: string
}

export type AgentJob = AgentUpdateJob

// Exporting Agent class as default
export default Agent
