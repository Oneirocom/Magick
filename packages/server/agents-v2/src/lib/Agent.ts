import { TypedEmitter } from 'tiny-typed-emitter'
import { Service, ServiceManager } from './core/service'
import { DIContainer } from './core/DIContainer'
import { AgentConfig } from './interfaces/agentConfig'
import { Container } from 'inversify'

// Define the base event types for the Agent
export interface BaseAgentEvents {
  initialized: () => void
  error: (error: Error) => void
}

export interface AgentConfigOptions {}

export class Agent extends TypedEmitter<BaseAgentEvents> {
  private container: Container
  di: DIContainer
  config: AgentConfig<AgentConfigOptions>
  private serviceManager: ServiceManager

  constructor(
    public readonly id: string,
    config: AgentConfig<AgentConfigOptions>
  ) {
    super()
    this.di = new DIContainer()
    this.container = new Container()
    this.serviceManager = new ServiceManager(this)
    this.config = config

    this.registerCoreServices()
  }

  registerCoreServices(): this {
    for (const serviceClass of Object.values(this.config.coreServices)) {
      this.serviceManager.use(serviceClass)
    }
    return this
  }

  register(serviceClass: new () => Service): this {
    this.serviceManager.use(serviceClass)
    return this
  }

  resolve<T>(key: string): T {
    return this.di.resolve<T>(key)
  }

  async initialize(): Promise<void> {
    try {
      await this.serviceManager.initialize()
      this.emit('initialized')
    } catch (error: any) {
      this.emit('error', error)
    }
  }
}
