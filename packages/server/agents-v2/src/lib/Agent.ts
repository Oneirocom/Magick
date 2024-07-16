import 'reflect-metadata'

import { TypedEmitter } from 'tiny-typed-emitter'
import { AgentConfig } from './interfaces/IAgentConfig'
import { Container, interfaces } from 'inversify'
import { IEventStore } from './interfaces/IEventStore'
import { EventEmitterWrapper } from './core/eventEmitterWrapped'
import { CommandHub } from './dependencies/commandHub'
import { ICommandHub } from './interfaces/ICommandHub'

import {
  CONFIG_TO_SERVICE_MAP,
  DependencyInterfaces,
  TYPES,
} from './dependencies/dependency.config'

// Define the base event types for the Agent
export interface BaseAgentEvents {
  initialized: () => void
  error: (error: Error) => void
}

// used to extend agent events for the command hub
export interface ICommandHubEvents {}

interface AgentEvents extends BaseAgentEvents, ICommandHubEvents {}

export interface AgentConfigOptions {}

export class Agent extends EventEmitterWrapper<AgentEvents> {
  container: Container
  config: AgentConfig<AgentConfigOptions>

  constructor(public readonly id: string, config: AgentConfig) {
    // Here we create a new event emitter from a passed in config dependency.
    // We extended from the EventEmitterWrapper class to enable custom event emitters we extend from.

    console.log('EVENT EMITTER', config)
    const eventEmitter =
      new config.dependencies.eventEmitter() as TypedEmitter<AgentEvents>
    super(eventEmitter)

    this.container = new Container()
    this.config = config

    // Lets register core services
    this.container.bind<Agent>(TYPES.Agent).toConstantValue(this)
    this.container
      .bind<AgentConfigOptions>(TYPES.Options)
      .toConstantValue(this.config.options)

    this.registerCoreDependencies()
    this.registerFactories()
  }

  private registerCoreDependencies(): void {
    // autoload depedencies
    for (const configKey in this.config.dependencies) {
      const { useSingleton, service } =
        CONFIG_TO_SERVICE_MAP[configKey as keyof typeof CONFIG_TO_SERVICE_MAP]

      const type = service as keyof typeof DependencyInterfaces
      const serviceClass =
        this.config.dependencies[
          configKey as keyof typeof CONFIG_TO_SERVICE_MAP
        ]

      const binding = this.container.bind(type).to(serviceClass)

      if (useSingleton) {
        binding.inSingletonScope()
      }
    }

    // Register command hub
    // We may still want to make this a configurable dependency
    this.container
      .bind<ICommandHub>(TYPES.CommandHub)
      .to(CommandHub)
      .inSingletonScope()
  }

  private registerFactories(): void {
    // register the event store factory
    this.container
      .bind<interfaces.Factory<IEventStore>>(TYPES['Factory<EventStore>'])
      .toFactory<IEventStore>((context: interfaces.Context) => {
        return () => {
          return context.container.get<IEventStore>(TYPES.EventStore)
        }
      })
  }

  async initialize(): Promise<void> {
    try {
      // await this.serviceManager.initialize()
      this.emit('initialized')
    } catch (error: any) {
      this.emit('error', error)
    }
  }
}
