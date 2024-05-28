import EventEmitter from 'events'
import pino from 'pino'
import Redis from 'ioredis'
import { v4 as uuidv4 } from 'uuid'

import {
  Engine,
  ILifecycleEventEmitter,
  readGraphFromJSON,
  IRegistry,
  GraphJSON,
  INode,
  IGraph,
  makeGraphApi,
  IStateService,
} from '@magickml/behave-graph' // Assuming BasePlugin is definedsuming SpellInterface is defined Assuming ILifecycleEventEmitter is defined
import { SpellInterface } from 'server/schemas'
import { type EventPayload } from 'server/plugin'
import { getLogger } from 'server/logger'
import { CORE_DEP_KEYS } from 'plugin/core'
import { AGENT_SPELL, AGENT_SPELL_STATE } from 'communication'
import { PluginManager } from 'server/pluginManager'
import { IEventStore, StatusEnum } from './services/eventStore'
import { BaseRegistry } from './baseRegistry'
import { SpellState } from './spellbook'
import { debounce } from 'lodash'

interface IAgent {
  id: string
  log: (message: string, data: Record<string, any>) => void
  warn: (message: string, data: Record<string, any>) => void
  error: (message: string, data: Record<string, any>) => void
}

/**
 * @class SpellCaster
 * @description
 * The `SpellCaster` class is a core component of our system, designed to manage the execution of spells
 * (defined workflows or logical sequences) within a graph-based architecture. This class embodies several
 * key software design principles and patterns that are crucial for a robust, scalable, and flexible system.
 * Understanding these principles will be vital for both utilizing and extending the `SpellCaster` effectively.
 *
 * Key Design Principles:
 * 1. Modularity: `SpellCaster` is designed as a self-contained module with a well-defined interface. This
 *    encapsulation allows for easy testing, maintenance, and scalability. It can be used in different contexts
 *    without affecting or being affected by other parts of the system.
 *
 * 2. Event-Driven Architecture: The class heavily relies on events for triggering and handling actions.
 *    This approach allows for decoupling components and promotes a reactive system where changes or specific
 *    conditions lead to corresponding actions.
 *
 * 3. Separation of Concerns: `SpellCaster` focuses solely on executing spells and managing their lifecycle.
 *    It separates the concerns of spell logic from other system functionalities like event handling or data
 *    persistence, ensuring that each module has a single responsibility.
 *
 * Usage Guidelines:
 * - Initialization: Before using `SpellCaster`, ensure that the spell configuration and registry are correctly
 * set up. The registry should include all necessary dependencies and configurations.
 *
 * - Event Handling: Utilize the `initializeHandlers` method to set up custom event listeners for node execution.
 * This method is crucial for monitoring and controlling the execution flow.
 *
 * - Graph Execution: The `executeGraphOnce` method allows for running the graph's nodes. It should be used
 * judiciously to control when and how often the graph is processed.
 *
 * - Extensibility: When extending `SpellCaster`, maintain the core principles and ensure that any additional
 * functionality aligns with the existing architecture.
 *
 * For junior developers:
 * Understanding `SpellCaster` is a great opportunity to learn about practical applications of design patterns
 * and principles. When working with this class, always consider how your changes or extensions will interact
 * with the existing architecture. Aim for clean, readable code that aligns with the principles outlined above.
 * Don't hesitate to ask questions or seek clarification as you navigate through the system.
 *
 * @example
 * // Example of using SpellCaster
 * const spellCaster = new SpellCaster({ loopDelay: 100, agent: agentInstance });
 * spellCaster.initialize(spellConfig, registry)
 *   .then(() => {
 *     // Spell is initialized and ready to execute
 *   })
 *   .catch(error => {
 *     // Handle initialization errors
 *   });
 */
export class SpellCaster<Agent extends IAgent = IAgent> {
  id: string = uuidv4()
  registry!: IRegistry
  engine!: Engine
  graph!: IGraph
  spell!: SpellInterface
  executeGraph = false
  pluginManager: PluginManager
  busy: boolean = true
  isLive: boolean = false
  private debug = true
  private agent
  private logger: pino.Logger
  private loopDelay: number
  private limitInSeconds: number
  private limitInSteps: number
  private connection: Redis
  private isRunning: boolean = true
  private debounceMap: Map<string, Function> = new Map()

  constructor({
    loopDelay = 100,
    limitInSeconds = 5,
    limitInSteps = 100,
    agent,
    pluginManager,
    connection,
    initialState,
  }: {
    connection: Redis
    loopDelay?: number
    limitInSeconds?: number
    limitInSteps?: number
    agent: Agent
    pluginManager: PluginManager
    initialState?: SpellState
  }) {
    this.connection = connection
    this.agent = agent
    this.pluginManager = pluginManager
    this.logger = getLogger()
    this.loopDelay = loopDelay
    this.limitInSeconds = limitInSeconds
    this.limitInSteps = limitInSteps

    // set the initial state if it is passed in
    if (initialState) {
      this.isRunning = initialState.isRunning
      this.debug = initialState.debug
    }
  }

  getState(): SpellState {
    return {
      isRunning: this.isRunning,
      debug: this.debug,
    }
  }

  syncState() {
    this.agent.pubsub.publish(AGENT_SPELL_STATE(this.agent.id), {
      spellId: this.spell.id,
      state: this.getState(),
    })
  }

  /**
   * Returns the lifecycle event emitter from the registry for easy access.
   * @returns The lifecycle event emitter.
   */
  get lifecycleEventEmitter(): ILifecycleEventEmitter | null {
    if (!this.registry?.dependencies['ILifecycleEventEmitter']) return null
    return this.registry.dependencies[
      'ILifecycleEventEmitter'
    ] as ILifecycleEventEmitter
  }

  /**
   * Initialize the spell caster. We are assuming here that the registry coming in is already
   * created by the main spellbook with the appropriate logger and other core dependencies.
   * @param spell - The spell to initialize.
   * @param registry - The registry to use.
   * @returns A promise that resolves when the spell caster is initialized.
   */
  async initialize(spell: SpellInterface): Promise<this> {
    try {
      const message = `SPELLBOOK: Initializing spellcaster for ${spell.id} in agent ${this.agent.id}`
      this.logger.debug(message)
      this.spell = spell

      // build the base registry
      const baseRegistry = new BaseRegistry(this.agent, this.connection)

      // Await the plugin manager to get the registry.  Made this async to allow dependencies to be async
      this.registry = await this.pluginManager.getRegistry(
        this,
        baseRegistry.getRegistry()
      )

      // build the graph api
      this.graph = makeGraphApi(this.registry)

      const graph = readGraphFromJSON({
        graphJson: this.spell.graph as GraphJSON,
        registry: this.registry,
      })

      // initialize the base registry once we have the full graph.
      // This sets up the state service properly.
      baseRegistry.init(this.graph, graph.nodes)

      this.engine = new Engine(graph.nodes)
      this.initializeHandlers()
      this.start()

      this.syncState()

      return this
    } catch (err: any) {
      console.log('Error initializing spell', err)
      this.error(
        `Error initializing spell ${this.spell.id} ${this.spell.name}`,
        err
      )
      return this
    }
  }

  loadInitialEvent(event: EventPayload) {
    this.graph
      .getDependency<IEventStore>(CORE_DEP_KEYS.EVENT_STORE)
      ?.setInitialEvent(event)
  }

  /**
   * Returns a dependency from the registry.
   * @param key - The key of the dependency.
   * @returns The dependency from the registry.
   * @example
   * const eventStore = spellCaster.getDependency<IEventStore>(CORE_DEP_KEYS.EVENT_STORE)
   */
  getDependency<T>(key: string): T | undefined {
    return this.graph.getDependency<T>(key)
  }

  /**
   * Log an error to the agent whichg is broadcast to the server, and relaye to clients
   * @param message - The message to log.
   * @param err - The error to log.w
   */
  error(message, err: any) {
    this.agent.error(err.toString(), {
      message,
      spellId: this.spell.id,
      projectId: this.spell.projectId,
    })
  }

  /**
   * Initialize the handlers for the spell caster.  We are listening for the node
   * execution end event so that we can emit the node work event.
   * @returns A promise that resolves when the handlers are initialized.
   */
  initializeHandlers() {
    this.engine.onNodeExecutionStart.addListener(
      this.executionStartHandler.bind(this)
    )
    this.engine.onNodeExecutionEnd.addListener(
      this.executionEndHandler.bind(this)
    )
    this.engine.onNodeExecutionError.addListener(
      this.executionErrorhandler.bind(this)
    )
  }

  private debounceEvent(
    event: string,
    callback: Function,
    delay: number,
    options: any = {}
  ) {
    if (!this.debounceMap.has(event)) {
      const debouncedFunction = debounce(
        () => {
          callback()
        },
        delay,
        {
          leading: false,
          trailing: true,
          ...options,
        }
      )

      this.debounceMap.set(event, debouncedFunction)
    }

    const debouncedFunction = this.debounceMap.get(event)
    if (debouncedFunction) debouncedFunction()
  }

  /**
   * This is the handler for the node execution start event. We emit the
   * node work event here to be sent up to appropriate clients.
   * @param node - The node that just started executing.
   * @returns A promise that resolves when the node work event is emitted.
   */
  executionStartHandler = async (node: any) => {
    if (this.debug && this.isLive) {
      const event = `${this.spell.id}-${node.id}-start`

      this.debounceEvent(
        event,
        () => {
          this.emitNodeWork({
            node,
            event,
            data: {
              inputs: node.inputs,
            },
          })
        },
        1000,
        {
          leading: true,
        }
      )
    }
  }

  /**
   * This is the handler for the node execution end event. We emit the
   * node work event here to be sent up to appropriate clients.
   * @param node - The node that just finished executing.
   * @returns A promise that resolves when the node work event is emitted.
   */
  executionEndHandler = async (node: any) => {
    if (this.debug && this.isLive) {
      const event = `${this.spell.id}-${node.id}-end`
      const startEvent = `${this.spell.id}-${node.id}-start`

      this.debounceEvent(
        event,
        () => {
          this.emitNodeWork({
            node,
            event,
            data: {
              outputs: node.outputs,
            },
          })
          this.debounceMap.delete(startEvent)
        },
        4000,
        {
          leading: false,
        }
      )
    }
  }

  executionErrorhandler = async ({ node, error }) => {
    const event = `${this.spell.id}-${node.id}-error`

    const message = `Node ${
      node.description.label
    } errored: ${error.toString()}`

    this.emitNodeWork({
      node,
      event,
      log: true,
      type: 'error',
      data: { message, error },
    })

    // make sure we set the event store to done so we can process the next event
    this.graph.getDependency<IEventStore>(CORE_DEP_KEYS.EVENT_STORE)?.done()
  }

  /**
   * emit the node work event to the agent when it is executed.
   * @param nodeId - The id of the node.
   * @param node - The node.
   * @returns A promise that resolves when the event is emitted.
   * @example
   * spellCaster.emitNodeWork(nodeId, node)
   */
  emitNodeWork({
    node,
    event,
    log = false,
    type = 'log',
    data = {},
  }: {
    node: INode
    event: string
    log?: boolean
    type?: string
    data?: Record<string, any>
  }) {
    const message = {
      event,
      log,
      message: `Node ${node.description.label} executed`,
      timestamp: new Date().toISOString(),
      nodeId: node.id,
      typeName: node.description.typeName,
      type,
      ...data,
    }

    this.emitAgentSpellEvent(message)
  }

  /**
   * Starts the run loop.  We set running to true, fire off the appropriate lifecycle events.
   * Then we loop through the engine and execute all the nodes.  We then wait for the loop delay
   * and then repeat. We are also ensuring that the engine is labelled busy when it is actively
   * processing nodes.  This will help with ensuring we can allocate work to another spell caster
   * if this one is busy.
   * @returns A promise that resolves when the run loop is started.
   */
  async start(): Promise<void> {
    this.logger.debug(
      'SPELLBOOK: Starting run loop for spell %s',
      this.spell.id
    )

    // eslint-disable-next-line
    while (true) {
      // Always loop
      if (this.isRunning || this.executeGraph) {
        await this.executeGraphOnce()
      }
      await new Promise(resolve => setTimeout(resolve, this.loopDelay))
    }
  }

  /**
   * Method which will run a single execution  on the graph. We tick the lifecycle event emitter
   * and then execute all the nodes in the graph.  We then set the busy flag to false. Finally
   * we set the executeGraph flag to false so that the spellbook knows that the spell is no longer
   * executing.
   * @returns A promise that resolves when the graph is executed.
   */
  async executeGraphOnce(isEnd = false): Promise<void> {
    if (!isEnd) this.lifecycleEventEmitter?.tickEvent.emit()

    try {
      await this.engine.executeAllAsync(this.limitInSeconds, this.limitInSteps)
    } catch (err: any) {
      this.error(
        `Error executing graph on spell ${this.spell.id} ${this.spell.name}`,
        err
      )
      // stop the run loop if we have an error
      this.isRunning = false
    }

    this.executeGraph = false // Reset the flag after execution
  }

  /**
   * Triggers the graph to execfute.  The flag is used in the loop to determine
   * if the graph should be executed
   * @example
   * spellCaster.triggerGraphExecution()
   */
  triggerGraphExecution(): void {
    this.executeGraph = true
  }

  getCurrentEventStateKey() {
    // return this.graph
    //   .getDependency<IStateService>(CORE_DEP_KEYS.STATE_SERVICE)
    //   ?.getState()
    return {} as any
  }

  /**
   * Starts the run loop.  This is called by the spellbook when the spell is started.
   */
  startRunLoop(): void {
    this.lifecycleEventEmitter?.startEvent.emit()
    this.isRunning = true
  }

  toggleLive(live: boolean) {
    this.isLive = live
  }

  /**
   * Stops the run loop.  This is called by the spellbook when the spell is stopped.
   */
  stopRunLoop(): void {
    // onnly execute once for the end event if it is running
    if (this.isRunning) {
      this.lifecycleEventEmitter?.endEvent.emit()
    }
    this.isRunning = false
  }

  toggleDebug(debug: boolean) {
    this.debug = debug
  }

  /**
   * This is the main entrypoint for the spellCaster.  It is called by the spellbook
   * when a spell receives an event.  We pass the event to the engine and it will
   * trigger the appropriate nodes to fire off a flow to get added to the fiber queue.
   * @param dependency - The name of the dependency. Often the plugin name.
   * @param eventName - The name of the event.
   * @param payload - The payload of the event.
   * @returns A promise that resolves when the event is handled.
   * @example
   */
  handleEvent(
    dependency: string,
    eventName: string,
    payload: EventPayload
  ): void {
    const message = `SpellCaster: Handling event ${eventName} for ${dependency} in spell ${this.spell.name}`
    this.logger.trace(message)
    this.agent.log(message, payload)
    // we grab the dependency from the registry and trigger it
    const eventEmitter = this.registry.dependencies[dependency] as
      | EventEmitter
      | undefined

    if (!eventEmitter) {
      this.logger.error(`No dependency found for ${dependency}`)
      return
    }

    // make a copy of the payload so we dont mutate the original

    //tag payload with spellcaster information
    payload.runInfo = {
      spellId: this.spell.id,
    }

    this.logger.trace(
      `SpellCaster: Setting run info for ${eventName} to spell ${this.spell.id}`
    )

    // we emit the event to the dependency which will commit the event to the engine
    eventEmitter.emit(eventName, payload)

    // we trigger the graph to execute if it our main loop isnt running
    this.triggerGraphExecution()
  }

  /**
   * Disposes the spell caster.  We stop the run loop, dispose the engine
   * and set running to false.
   * @example
   * spellCaster.dispose()
   * @returns A promise that resolves when the spell caster is disposed.
   */
  dispose() {
    this.logger.debug(`Disposing spell caster for ${this.spell.id}`)
    this.stopRunLoop()
    if (this.engine) this.engine.dispose()
    this.clearLifecycleListeners()
  }

  clearLifecycleListeners() {
    this.lifecycleEventEmitter?.endEvent.clear()
    this.lifecycleEventEmitter?.startEvent.clear()
    this.lifecycleEventEmitter?.tickEvent.clear()
  }

  /**
   * Returns the busy state of the spell caster.
   * @returns The busy state of the spell caster.
   * @example
   * const isBusy = spellCaster.isBusy()
   * if (isBusy) {
   *  // do something
   * }
   */
  isBusy() {
    if (!this.graph) return false
    const status = this.graph
      .getDependency<IEventStore>(CORE_DEP_KEYS.EVENT_STORE)
      ?.getStatus()

    return status === StatusEnum.RUNNING
  }

  resetState() {
    this.graph
      .getDependency<IStateService>(CORE_DEP_KEYS.STATE_SERVICE)
      ?.resetState()
  }

  /*
   * This is the entrypoint for the spellCaster.  It is called by the spellbook
   * when a spell receives an event.  We pass the event to the engine and it will
   * trigger the appropriate nodes to fire off a flow to get added to the fiber queue.
   * @param dependency - The name of the dependency. Often the plugin name.
   * @param eventName - The name of the event.
   * @param payload - The payload of the event.
   * @returns A promise that resolves when the event is handled.
   * @example
   */
  emitAgentSpellEvent(_message) {
    // same message emitted from server or agent
    const message = {
      ..._message,
      // make sure the message contains the spellId in case it is needed.
      spellId: this.spell.id,
      projectId: this.spell.projectId,
    }

    this.agent.publishEvent(AGENT_SPELL(this.agent.id), message)
  }
}
