import EventEmitter from 'events'
import pino from 'pino'

import {
  Engine,
  ILifecycleEventEmitter,
  readGraphFromJSON,
  IRegistry,
  GraphJSON,
  INode,
} from '@magickml/behave-graph' // Assuming BasePlugin is definedsuming SpellInterface is defined Assuming ILifecycleEventEmitter is defined
import { SpellInterface } from 'server/schemas'
import { type EventPayload } from 'server/plugin'
import { getLogger } from 'server/logger'
import { AGENT_SPELL } from 'shared/core'
interface IAgent {
  id: string
}

class SpellCaster<Agent extends IAgent> {
  registry!: IRegistry
  engine!: Engine
  busy = false
  spell!: SpellInterface
  executeGraph = false
  private agent
  private logger: pino.Logger
  private isRunning: boolean = false
  private loopDelay: number
  private limitInSeconds: number
  private limitInSteps: number

  constructor({
    loopDelay = 100,
    limitInSeconds = 5,
    limitInSteps = 100,
    agent,
  }: {
    loopDelay?: number
    limitInSeconds?: number
    limitInSteps?: number
    agent: Agent
  }) {
    this.agent = agent
    this.logger = getLogger()
    this.loopDelay = loopDelay
    this.limitInSeconds = limitInSeconds
    this.limitInSteps = limitInSteps
  }

  /**
   * Returns the lifecycle event emitter from the registry for easy access.
   * @returns The lifecycle event emitter.
   */
  get lifecycleEventEmitter(): ILifecycleEventEmitter {
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
  async initialize(spell: SpellInterface, registry: IRegistry): Promise<this> {
    this.logger.debug(
      `SPELLBOOK: Initializing spellcaster for ${spell.id} in agent ${this.agent.id}`
    )
    this.spell = spell
    this.registry = registry
    const graph = readGraphFromJSON({
      graphJson: this.spell.graph as GraphJSON,
      registry: registry,
    })

    this.engine = new Engine(graph.nodes)
    this.initializeHandlers()
    this.start()
    return this
  }

  /**
   * Initialize the handlers for the spell caster.  We are listening for the node
   * execution end event so that we can emit the node work event.
   * @returns A promise that resolves when the handlers are initialized.
   */
  initializeHandlers() {
    // this.engine.onNodeExecutionStart.addListener(node => {
    //   this.logger.trace(`<< ${node.description.typeName} >> START`)
    // })
    this.engine.onNodeExecutionEnd.addListener(
      this.executionEndHandler.bind(this)
    )
  }

  /**
   * This is the handler for the node execution end event. We emit the
   * node work event here to be sent up to appropriate clients.
   * @param node - The node that just finished executing.
   * @returns A promise that resolves when the node work event is emitted.
   */
  executionEndHandler = async (node: any) => {
    let foundNode: INode | null = null
    let id: string | null = null

    // We should keep an eye on this as it may reduce performance over large graphs.
    // We are looping through the engine nodes to find the node that matches the one
    // that just finished executing.  We are doing this because the node that is passed
    // does not cotnain the node id which we need to broadcast the work being done.
    for (const [nodeId, engineNode] of Object.entries(this.engine.nodes)) {
      if (
        engineNode.metadata.positionX === node.metadata.positionX &&
        engineNode.metadata.positionY === node.metadata.positionY
      ) {
        id = nodeId
        foundNode = engineNode
      }
    }

    if (!foundNode) {
      this.logger.debug(
        `SPELLCASTER: Could not find node in engine for spell ${this.spell.id}`
      )
      return
    }

    await this.emitNodeWork(id as string, node)
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
    if (isEnd) this.lifecycleEventEmitter.endEvent.emit()
    if (!isEnd) this.lifecycleEventEmitter.tickEvent.emit()
    this.busy = true
    await this.engine.executeAllAsync(this.limitInSeconds, this.limitInSteps)
    this.busy = false
    this.executeGraph = false // Reset the flag after execution
  }

  /**
   * Triggers the graph to execfute.  The flag is used in the loop to determine
   * if the graph should be executed.
   * @example
   * spellCaster.triggerGraphExecution()
   */
  triggerGraphExecution(): void {
    this.executeGraph = true
  }

  /**
   * Starts the run loop.  This is called by the spellbook when the spell is started.
   */
  startRunLoop(): void {
    this.lifecycleEventEmitter.startEvent.emit()
    this.isRunning = true
  }

  /**
   * Stops the run loop.  This is called by the spellbook when the spell is stopped.
   */
  stopRunLoop(): void {
    // onnly execute once for the end event if it is running
    if (this.isRunning) this.executeGraphOnce(true)
    this.isRunning = false
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
    // we grab the dependency from the registry and trigger it
    const eventEmitter = this.registry.dependencies[dependency] as
      | EventEmitter
      | undefined

    if (!eventEmitter) {
      this.logger.error(`No dependency found for ${dependency}`)
      return
    }

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
    this.engine.dispose()
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
    return this.busy
  }

  /**
   * emit the node work event to the agent when it is executed.
   * @param nodeId - The id of the node.
   * @param node - The node.
   * @returns A promise that resolves when the event is emitted.
   * @example
   * spellCaster.emitNodeWork(nodeId, node)
   */
  emitNodeWork(nodeId: string, node: INode) {
    const event = `${this.spell.id}-${nodeId}`

    const message = {
      event,
      nodeId,
      type: node.description.typeName,
      outputs: node.outputs,
      inputs: node.inputs,
    }

    this.emitAgentSpellEvent(message)
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

export default SpellCaster
