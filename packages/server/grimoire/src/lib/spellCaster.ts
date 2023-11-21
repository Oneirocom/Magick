import { get } from 'lodash/get'
import {
  Engine,
  ILogger,
  Registry,
  ILifecycleEventEmitter,
  readGraphFromJSON,
  ManualLifecycleEventEmitter,
  IRegistry,
  GraphJSON,
} from '@magickml/behave-graph'
import BasePlugin from './BasePlugin' // Assuming BasePlugin is definedsuming SpellInterface is defined Assuming ILifecycleEventEmitter is defined
import type { SpellInterface } from 'server/core'

type RegistryFactory = (registry: IRegistry) => IRegistry

class SpellCaster {
  private engine!: Engine
  private logger: ILogger
  private plugins: BasePlugin[]
  private isRunning: boolean = false
  private loopDelay: number
  private limitInSeconds: number
  private limitInSteps: number
  private spell!: SpellInterface
  private lifecycleEventEmitter: ILifecycleEventEmitter
  private eventEmitters: Map<string, EventEmitter>

  constructor(
    logger: ILogger,
    loopDelay: number,
    limitInSeconds: number,
    limitInSteps: number
  ) {
    this.logger = logger
    this.loopDelay = loopDelay
    this.limitInSeconds = limitInSeconds
    this.limitInSteps = limitInSteps
    this.plugins = []
    this.eventEmitters = new Map()
    this.lifecycleEventEmitter = new ManualLifecycleEventEmitter()
  }

  async initialize(
    spell: SpellInterface,
    baseRegistry: RegistryFactory,
    plugins: BasePlugin[]
  ): Promise<void> {
    this.spell = spell
    this.plugins = plugins
    const registry = this.buildRegistry(baseRegistry)
    const graph = readGraphFromJSON({
      graphJson: this.spell.graph as GraphJSON,
      registry: registry,
    })

    this.plugins.forEach(plugin => {
      this.eventEmitters.set(plugin.name, plugin.eventEmitter)
    })

    this.engine = new Engine(graph.nodes)
    this.startRunLoop()
  }

  private buildRegistry(baseRegistry: RegistryFactory): IRegistry {
    const combinedRegistry = this.plugins.reduce((acc, plugin) => {
      const newRegistry = baseRegistry(plugin.getRegistry())
      return newRegistry
    }, baseRegistry)

    return combinedRegistry
  }

  async startRunLoop(): Promise<void> {
    this.isRunning = true
    this.lifecycleEventEmitter.startEvent.emit()
    while (this.isRunning) {
      this.lifecycleEventEmitter.tickEvent.emit()
      await this.engine.executeAllAsync(this.limitInSeconds, this.limitInSteps)
      await new Promise(resolve => setTimeout(resolve, this.loopDelay))
    }
  }

  stopRunLoop(): void {
    this.isRunning = false
    this.lifecycleEventEmitter.endEvent.emit()
  }

  handleEvent(eventName: string, payload: any): void {
    const eventEmitter = this.eventEmitters.get(eventName)
    if (eventEmitter) {
      eventEmitter.emit(eventName, payload)
    }
  }

  dispose() {
    this.engine.dispose()
    this.isRunning = false
  }

  // Other methods as required
}

export default SpellCaster
