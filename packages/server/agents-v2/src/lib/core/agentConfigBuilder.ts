import { IStateService } from '@magickml/behave-graph'
import { AgentConfigOptions } from '../Agent'
import { AgentConfig } from '../interfaces/agentConfig'
// import { IDatabaseService } from '../interfaces/database'
import { Service } from './service'
import {
  ConfigServiceType,
  DEFAULT_SERVICES,
  ServiceInterface,
} from '../interfaces/types'

export interface ILLMService {
  log(level: string, message: string): void
}

export class AgentConfigBuilder<T = AgentConfigOptions> {
  private config: Partial<AgentConfig<T>> = {
    coreServices: {} as AgentConfig<T>['coreServices'],
    additionalServices: new Map(),
    options: {} as T,
  }

  private requiredDependencies: Partial<Record<ConfigServiceType, boolean>> = {}

  withStateService(ServiceClass: new () => Service<IStateService>): this {
    if (!this.config.coreServices) {
      this.config.coreServices = {} as AgentConfig<T>['coreServices']
    }
    this.config.coreServices['stateService'] = ServiceClass
    this.requiredDependencies['stateService'] = true
    return this
  }

  // withDatabaseService(ServiceClass: new () => Service<IDatabaseService>): this {
  //   if (!this.config.coreServices) {
  //     this.config.coreServices = {} as AgentConfig<T>['coreServices']
  //   }
  //   this.config.coreServices['database'] = ServiceClass
  //   this.requiredDependencies['database'] = true
  //   return this
  // }

  withRedisService(
    ServiceClass: new () => Service<ServiceInterface<'RedisService'>>
  ): this {
    if (!this.config.coreServices) {
      this.config.coreServices = {} as AgentConfig<T>['coreServices']
    }
    this.config.coreServices['redis'] = ServiceClass
    this.requiredDependencies['redis'] = true
    return this
  }

  withPluginManagerService(
    ServiceClass: new () => Service<ServiceInterface<'PluginManagerService'>>
  ): this {
    if (!this.config.coreServices) {
      this.config.coreServices = {} as AgentConfig<T>['coreServices']
    }
    this.config.coreServices['pluginManager'] = ServiceClass
    this.requiredDependencies['pluginManager'] = true
    return this
  }

  withOptions(options: T): this {
    this.config.options = options
    return this
  }

  // withDatabase(factory: () => Service<IDatabaseService>): this {
  //   this.config.database = factory
  //   this.requiredDependencies['database'] = true
  //   return this
  // }

  // withLLMProvider(factory: () => Service<ILLMService>): this {
  //   this.config.llmProvider = factory
  //   this.requiredDependencies['llmProvider'] = true
  //   return this
  // }

  // Add other configuration methods as needed...

  build(): AgentConfig<T> {
    const missingServices: ConfigServiceType[] = []

    ;(Object.keys(this.requiredDependencies) as ConfigServiceType[]).forEach(
      key => {
        if (!this.requiredDependencies[key]) {
          if (key in DEFAULT_SERVICES) {
            console.warn(
              `Service ${key} not provided, using default implementation.`
            )
            // @ts-ignore - This is safe because we checked for the key in DEFAULT_SERVICES
            this.config.coreServices![key] = DEFAULT_SERVICES[key]!
          } else {
            missingServices.push(key)
          }
        }
      }
    )

    if (missingServices.length > 0) {
      throw new Error(
        `Missing required services without defaults: ${missingServices.join(
          ', '
        )}`
      )
    }

    return this.config as AgentConfig<T>
  }
}
