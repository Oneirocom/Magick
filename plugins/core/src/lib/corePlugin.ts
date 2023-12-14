import {
  ActionPayload,
  CoreEventsPlugin,
  EventPayload,
  ON_MESSAGE,
} from 'server/plugin'
import { messageEvent } from './nodes/events/messageEvent'
import Redis from 'ioredis'
import { CoreEmitter } from './dependencies/coreEmitter'
import { IRegistry, registerCoreProfile } from '@magickml/behave-graph'
import CoreEventClient from './services/coreEventClient'
import { RedisPubSub } from 'server/redis-pubsub'
import { CoreActionService } from './services/coreActionService'
import { sendMessage } from './nodes/actions/sendMessage'
import { FetchNode } from './nodes/actions/Fetch'
import { Job } from 'bullmq'
import { SpellCaster } from 'server/grimoire'

const pluginName = 'Core'

/**
 * CorePlugin handles all generic events and has its own nodes, dependencies, and values.
 */
export class CorePlugin extends CoreEventsPlugin {
  override enabled = true
  client: CoreEventClient
  nodes = [messageEvent, sendMessage, FetchNode.Description]
  values = []

  constructor(connection: Redis, agentId: string, pubSub: RedisPubSub) {
    super(pluginName, connection, agentId)

    this.client = new CoreEventClient(pubSub, agentId)
  }

  /**
   * Defines the events that the plugin will listen for.
   */
  defineEvents() {
    // Define events here
    this.registerEvent({
      eventName: ON_MESSAGE,
      displayName: 'Message Received',
    })
  }

  /**
   * Defines the actions that the plugin will handle.
   */
  defineActions() {
    // Define actions here
    this.registerAction({
      actionName: 'sendMessage',
      displayName: 'Send Message',
      handler: this.handleSendMessage.bind(this),
    })
  }

  /**
   * Defines the dependencies that the plugin will use. Creates a new set of dependencies every time.
   */
  getDependencies(spellCaster: SpellCaster) {
    return {
      [pluginName]: new CoreEmitter(),
      coreActionService: new CoreActionService(
        this.connection,
        this.actionQueueName
      ),
    }
  }

  /**
   * Provides the core registry from Behave Graph. Wraps our existing nodes and values.
   * @param registry The registry to provide.
   */
  override provideRegistry(registry: IRegistry): IRegistry {
    return registerCoreProfile(registry)
  }

  initializeFunctionalities() {
    this.centralEventBus.on(ON_MESSAGE, this.handleOnMessage.bind(this))
    this.client.onMessage(this.handleOnMessage.bind(this))
  }

  handleOnMessage(payload: EventPayload) {
    const event = this.formatMessageEvent(ON_MESSAGE, payload)
    this.emitEvent(ON_MESSAGE, event)
  }

  handleSendMessage(actionPayload: Job<ActionPayload>) {
    const { actionName, event } = actionPayload.data
    const { plugin } = event
    const eventName = `${plugin}:${actionName}`
    // handle sending a message back out.

    if (plugin === 'Core') {
      this.client.sendMessage(actionPayload.data)
    } else {
      this.centralEventBus.emit(eventName, actionPayload.data)
    }
  }

  /**
   * We dont need to format the payload for this plugin. This is
   * because the payload is already formatted in the core plugin.
   * @param event
   * @param payload
   */
  formatPayload(event, payload) {
    return payload
  }
}
