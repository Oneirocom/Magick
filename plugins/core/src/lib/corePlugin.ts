import {
  ActionPayload,
  CoreEventsPlugin,
  EventPayload,
  ON_MESSAGE,
} from 'server/plugin'
import { messageEvent } from './nodes/events/messageEvent'
import Redis from 'ioredis'
import { CoreEmitter } from './dependencies/coreEmitter'
import { ILogger, IRegistry, registerCoreProfile } from '@magickml/behave-graph'
import CoreEventClient from './services/coreEventClient'
import { RedisPubSub } from 'server/redis-pubsub'
import { CoreActionService } from './services/coreActionService'
import { sendMessage } from './nodes/actions/sendMessage'
import { Job } from 'bullmq'
import { textTemplate } from './nodes/functions/textTemplate'
import { registerStructProfile } from './registerStructProfile'

const pluginName = 'Core'

// These nodes are removed from the core plugin because we have others that
// do the same thing but are more specific. For example, the variable/get
// node is removed because we have our own nodes that do
// the same thing but  more specific.
const removedNodes = ['variable/get', 'variable/set']

/**
 * CorePlugin handles all generic events and has its own nodes, dependencies, and values.
 */
export class CorePlugin extends CoreEventsPlugin {
  override enabled = true
  client: CoreEventClient
  nodes = [messageEvent, sendMessage, textTemplate]
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
  getDependencies() {
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
    const _coreRegistry = registerCoreProfile(registry)
    const coreRegistry = {
      ..._coreRegistry,
      // turn nodes map into array to filter
      nodes: Object.entries(_coreRegistry.nodes).reduce((acc, [key, value]) => {
        if (removedNodes.includes(key)) return acc
        return { ...acc, [key]: value }
      }, {}),
    }
    const logger = (coreRegistry.dependencies.ILogger as ILogger) || undefined

    return registerStructProfile(coreRegistry, logger)
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
  formatPayload(_, payload) {
    return payload
  }
}
