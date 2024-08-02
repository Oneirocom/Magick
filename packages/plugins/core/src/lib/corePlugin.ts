import { CoreEventsPlugin } from '@magickml/agent-plugin'
import { RedisPubSub } from '@magickml/redis-pubsub'
import { SpellCaster } from '@magickml/agent-service'
import { DATABASE_URL } from '@magickml/server-config'

import { CoreLLMService } from './services/coreLLMService/coreLLMService'
import { messageEvent } from './nodes/events/messageEvent'
import Redis from 'ioredis'
import { ILogger, IRegistry, registerCoreProfile } from '@magickml/behave-graph'
import CoreEventClient from './services/coreEventClient'
import { CoreActionService } from './services/coreActionService'
import { generateText } from './nodes/actions/generateText'
import { sendMessage } from './nodes/actions/sendMessage'
import { textTemplate } from './nodes/functions/textTemplate'
import { registerStructProfile } from './registerStructProfile'
import { streamMessage } from './nodes/actions/streamMessage'
import { variableGet } from './nodes/query/variableGet'
import { VariableService } from './services/variableService'
import { variableSet } from './nodes/query/variableSet'
import { arrayPush } from './values/Array/Push'
import { jsonStringify } from './nodes/actions/jsonStringify'
import { forEach } from './values/Array/ForEach'
import { arrayLength } from './values/Array/Length'
import { arrayClear } from './values/Array/Clear'
import { whileLoop } from './nodes/flow/whileLoop'
import { regex } from './nodes/logic/match'
import { stringSplit } from './nodes/logic/strings/split'
import { arrayRemoveFirst, arrayRemoveLast } from './values/Array/Remove'
import { arrayMerge } from './values/Array/Merge'
import { CoreUserService } from './services/userService/coreUserService'
import { arrayCreate, arrayCreateFunction } from './values/Array/Create'
import { CoreMemoryService } from './services/coreMemoryService/coreMemoryService'
import { addKnowledge } from './nodes/actions/addKnowledge'
import { queryKnowledge } from './nodes/actions/queryKnowledge'
import { searchKnowledge } from './nodes/actions/searchKnowledge'
import { searchManyKnowledge } from './nodes/actions/searchManyKnowledge'
import {
  coreDefaultState,
  corePluginCredentials,
  corePluginName,
  coreRemovedNodes,
  formatCoreWebhookPayload,
  validateCoreWebhookPayload,
  type CorePluginEvents,
  type CorePluginState,
  type CoreWebhookPayload,
} from './config'
import { EventTypes } from '@magickml/agent-communication'
import { delay } from './nodes/time/delay'
import { queryEventHistory } from './nodes/events/eventHistory'
import { webhookEventNode } from './nodes/events/onWebhook'
import { getStateNode } from './nodes/_uncategorized/getState'
import { getSecretNode } from './nodes/_uncategorized/getSecret'
import { FetchNode } from './nodes/actions/fetch'
import {
  type CorePluginCredentials,
  CORE_COMMANDS,
  CORE_EVENTS,
  CORE_ACTIONS,
  CORE_DEPENDENCIES,
} from './configx'
import { getMessageHistory } from './nodes/actions/messageHistory'
import { objectDestructure } from './nodes/functions/destructure'
import { IsDefined } from './nodes/logic/strings/isDefined'
import { jsonParse } from './nodes/actions/jsonParse'
import { clearMessageHistory } from './nodes/actions/clearMessageHistory'
import { LifecycleOnTick } from './nodes/lifecycle/onTick'
import { arrayRandomElement } from './values/Array/Random'
import { wait } from './nodes/flow/wait'
import { variablesReset } from './nodes/query/variableReset'
import { flowSwitch } from './nodes/flow/switch'
import { addMessage } from './nodes/actions/addMessage'
import { stringChunker } from './nodes/actions/stringChunker'
import { MemoryStreamService } from './services/memoryStreamService'
import { addMemory } from './nodes/actions/addMemory'
import { onMemory } from './nodes/events/onMemory'
import { getMemories } from './nodes/actions/getMemories'
import { clearMemories } from './nodes/actions/clearMemories'
import { parseCommand } from './nodes/logic/strings/parseCommand'
import { DoOnceAsync } from './nodes/flow/doOnceAsync'
import { arrayIncludes } from './values/Array/Includes'
import { getManyVariables } from './nodes/query/getManyVariables'
import {
  ActionPayload,
  CORE_DEP_KEYS,
  EventPayload,
  LLMProviderKeys,
} from '@magickml/shared-services'
import { arrayAccess } from './values/Array/Access'
import { flowSplit } from './nodes/flow/split'
import { onVariableChanged } from './nodes/events/onVariableChanged'
import { stringReplace } from './nodes/functions/stringReplace'
/**
 * CorePlugin handles all generic events and has its own nodes, dependencies, and values.
 */
export class CorePlugin extends CoreEventsPlugin<
  typeof CORE_EVENTS,
  typeof CORE_ACTIONS,
  typeof CORE_DEPENDENCIES,
  typeof CORE_COMMANDS,
  CorePluginCredentials,
  CorePluginEvents,
  EventPayload,
  Record<string, unknown>,
  Record<string, unknown>,
  CorePluginState
> {
  override defaultState = coreDefaultState
  client: CoreEventClient
  nodes = [
    addKnowledge,
    addMemory,
    addMessage,
    arrayAccess,
    arrayClear,
    arrayCreate,
    arrayCreateFunction,
    arrayIncludes,
    arrayLength,
    arrayMerge,
    arrayPush,
    arrayRandomElement,
    arrayRemoveFirst,
    arrayRemoveLast,
    clearMemories,
    clearMessageHistory,
    delay,

    DoOnceAsync,
    FetchNode,
    flowSplit,
    flowSwitch,
    forEach,
    generateText,
    getManyVariables,
    getMemories,
    getMessageHistory,
    getSecretNode,
    getStateNode,
    IsDefined,
    jsonParse,
    jsonStringify,
    LifecycleOnTick,
    messageEvent,
    objectDestructure,
    onMemory,
    onVariableChanged,
    parseCommand,
    queryEventHistory,
    queryKnowledge,
    regex,
    searchKnowledge,
    searchManyKnowledge,
    sendMessage,
    streamMessage,
    stringChunker,
    stringReplace,
    stringSplit,
    textTemplate,
    variableGet,
    variableSet,
    variablesReset,
    wait,
    webhookEventNode,
    whileLoop,
  ]
  values = []
  credentials = corePluginCredentials
  coreLLMService: CoreLLMService
  coreMemoryService = new CoreMemoryService(true)
  userService: CoreUserService

  constructor({
    connection,
    agent,
    pubSub,
    projectId,
  }: {
    connection: Redis
    agent: any
    pubSub: RedisPubSub
    projectId: string
  }) {
    super({ name: corePluginName, connection, agent, projectId })
    this.client = new CoreEventClient({ pubSub, agent })

    this.coreLLMService = new CoreLLMService({
      projectId,
      agentId: this.agentId,
      agent,
    })

    this.userService = new CoreUserService({ projectId })
  }

  getPluginConfig() {
    return {
      events: CORE_EVENTS,
      actions: CORE_ACTIONS,
      dependencyKeys: CORE_DEPENDENCIES,
      commands: CORE_COMMANDS,
      developerMode: false,
      credentials: corePluginCredentials,
    }
  }

  // LIFECYCLE
  async beforeActivate() {}

  async afterActivate() {
    this.logger.info('CorePlugin activated')
    await this.getLLMCredentials()

    this.centralEventBus.on(
      EventTypes.ON_MESSAGE,
      this.handleOnMessage.bind(this)
    )
    this.client.onMessage(this.handleOnMessage.bind(this))
  }

  async beforeDeactivate() {}
  async afterDeactivate() {}
  beforeDestroy() {}
  afterDestroy() {}

  // COMMANDS
  getCommandHandlers() {
    return {}
  }

  handleEnableCommand() {}
  handleDisableCommand() {}
  handleLinkCommand() {}
  handleUnlinkCommand() {}

  handleWebhookCommand(payload: CoreWebhookPayload) {
    if (!validateCoreWebhookPayload(payload)) {
      return
    }
    const p = formatCoreWebhookPayload(payload, this.agentId)
    this.logger.info('Webhook event received:', p)
    this.emitEvent(EventTypes.ON_WEBHOOK, p)
  }

  /**
   * Defines the events that the plugin will listen for.
   */
  defineEvents() {
    // Define events here
    this.registerEvent({
      eventName: EventTypes.ON_MESSAGE,
      displayName: 'Message Received',
    })
    this.registerEvent({
      eventName: EventTypes.ON_WEBHOOK,
      displayName: 'Webhook Received',
    })
  }

  getActionHandlers() {
    return {
      [CORE_ACTIONS.messageSend]: this.handleSendMessage,
      [CORE_ACTIONS.messageStream]: this.handleStreamMessage,
      [CORE_ACTIONS.error]: this.handleSendMessage,
    }
  }

  /**
   * Defines the dependencies that the plugin will use. Creates a new set of dependencies every time.
   */
  async getDependencies(spellCaster: SpellCaster<any>) {
    try {
      await this.coreLLMService.initialize()
      // await this.coreBudgetManagerService.initialize()
      await this.coreMemoryService.initialize(this.projectId)
    } catch (error) {
      this.logger.error('Error initializing dependencies:')
    }

    return {
      [CORE_DEP_KEYS.AGENT]: this.agent,
      [CORE_DEP_KEYS.MEMORY_STREAM_SERVICE]: new MemoryStreamService(
        this.agentId,
        spellCaster
      ),

      [CORE_DEP_KEYS.ACTION_SERVICE]: new CoreActionService(
        this.centralEventBus,
        this.actionQueueName
      ),
      [CORE_DEP_KEYS.I_VARIABLE_SERVICE]: new VariableService(
        DATABASE_URL as string,
        this.agentId,
        spellCaster
      ),
      [CORE_DEP_KEYS.LLM_SERVICE]: this.coreLLMService,
      [CORE_DEP_KEYS.MEMORY_SERVICE]: this.coreMemoryService,

      [CORE_DEP_KEYS.GET_STATE]: this.stateManager.getGlobalState.bind(this),
      [CORE_DEP_KEYS.GET_SECRET]:
        this.credentialsManager.getCustomCredential.bind(this),
    }
  }

  async getLLMCredentials() {
    await this.credentialsManager.update()
    try {
      // Loop through all providers defined in the Providers enum except for LLMProviders.Unknown
      for (const providerKey of Object.keys(LLMProviderKeys).filter(
        key =>
          LLMProviderKeys[key as keyof typeof LLMProviderKeys] !==
          LLMProviderKeys.Unknown
      )) {
        const provider =
          LLMProviderKeys[providerKey as keyof typeof LLMProviderKeys]

        // Retrieve credentials for each provider
        // @ts-ignore
        const credential = this.credentialsManager.getCredential(provider)

        // Check if credentials are retrieved and valid
        if (credential) {
          // Add each credential to the CoreLLMService instance
          this.coreLLMService.addCredential({
            ...corePluginCredentials[0],
            name: provider,
            value: credential,
          })
          this.coreMemoryService.addCredential({
            ...corePluginCredentials[0],
            name: provider,
            value: credential,
          })
        }
      }
    } catch (error) {
      this.logger.error(error, 'Error retrieving LLM credentials:')
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
        if (coreRemovedNodes.includes(key)) return acc
        return { ...acc, [key]: value }
      }, {}),
    }
    const logger = (coreRegistry.dependencies.ILogger as ILogger) || undefined

    return registerStructProfile(coreRegistry, logger)
  }

  handleOnMessage(payload: EventPayload) {
    const event = this.formatMessageEvent(EventTypes.ON_MESSAGE, payload)
    this.emitEvent(EventTypes.ON_MESSAGE, event)
  }

  private handleMessageSend(
    actionPayload: ActionPayload,
    messageHandler: (payload: ActionPayload) => void
  ) {
    const { actionName, event } = actionPayload
    const { plugin } = event
    const eventName = `${plugin}:${actionName}`
    this.logger.trace(`Sending message to ${eventName} on core plugin`)

    if (plugin === corePluginName) {
      messageHandler(actionPayload)
    } else {
      this.centralEventBus.emit(eventName, actionPayload)
    }
  }

  handleStreamMessage(payload: ActionPayload) {
    this.handleMessageSend(payload, this.client.streamMessage.bind(this.client))
  }

  handleSendMessage(actionPayload: ActionPayload) {
    this.handleMessageSend(
      actionPayload,
      this.client.sendMessage.bind(this.client)
    )
  }

  /**
   * Handles errors by sending them to the appropriate event.
   * This allows us to send errors back to the originating plugin so they can handle reporting
   * and logging of the error.
   */
  handleOnError(actionPayload: ActionPayload) {
    const { actionName, event } = actionPayload
    const { plugin } = event
    const eventName = `${plugin}:${actionName}`
    this.logger.trace(`Sending error to ${eventName} on core plugin`)
    // handle sending a message back out.

    if (plugin === corePluginName) {
      this.client.sendMessage(actionPayload)
    } else {
      this.centralEventBus.emit(eventName, actionPayload)
    }
  }

  /**
   * We dont need to format the payload for this plugin. This is
   * because the payload is already formatted in the core plugin.
   * @param event
   * @param payload
   */
  formatPayload(_: unknown, payload: EventPayload) {
    return payload
  }
}
