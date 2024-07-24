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
import { ISpellbook } from './interfaces/ISpellbook'
import { ChannelInterface } from './interfaces/IChannelManager'
import { Spellbook } from './dependencies/spellbook'
import { ISpellCaster } from './interfaces/ISpellcaster'
import { ISpell } from './interfaces/spell'
import { SpellCaster } from './dependencies/spellcaster'

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

    // spellbook factory
    this.container
      .bind<interfaces.Factory<ISpellbook>>(TYPES['Factory<Spellbook>'])
      .toFactory<ISpellbook, [ChannelInterface]>(
        (context: interfaces.Context) => {
          return (channel: ChannelInterface) => {
            const spellbook = context.container.get<ISpellbook>(TYPES.Spellbook)
            ;(spellbook as ISpellbook).setChannel(channel)
            return spellbook
          }
        }
      )

    this.container
      .bind<ISpellbook>(TYPES.Spellbook)
      .to(Spellbook)
      .inTransientScope()

    // spellcaster factory
    this.container
      .bind<interfaces.Factory<ISpellCaster>>(TYPES['Factory<SpellCaster>'])
      .toFactory<ISpellCaster, [ISpell]>((context: interfaces.Context) => {
        return (spell: ISpell) => {
          const spellCaster = context.container.get<ISpellCaster>(
            TYPES.SpellCaster
          )
          ;(spellCaster as ISpellCaster).initialize()
          // we will handle initializing in a bit
          return spellCaster
        }
      })

    this.container
      .bind<ISpellCaster>(TYPES.SpellCaster)
      .to(SpellCaster)
      .inTransientScope()
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
