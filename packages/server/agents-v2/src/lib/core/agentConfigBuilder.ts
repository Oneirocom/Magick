import { IStateService } from '@magickml/behave-graph'
import { AgentConfigOptions } from '../Agent'
import { AgentConfig, BaseConfig } from '../interfaces/IAgentConfig'
import {
  ConfigServiceType,
  ServiceInterface,
} from '../interfaces/IDependencies'
import { DEFAULT_DEPENDENCIES } from '../dependencies/defaultDependencies'

export class AgentConfigBuilder<
  T extends Record<string, any> = AgentConfigOptions
> {
  private config: AgentConfig<T> = {
    options: {} as T,
    dependencies: {} as BaseConfig,
  }

  private requiredDependencies: Set<ConfigServiceType> = new Set(
    Object.keys(DEFAULT_DEPENDENCIES) as ConfigServiceType[]
  )

  withStateService(ServiceClass: new () => IStateService): this {
    this.config.dependencies.stateService = ServiceClass
    this.requiredDependencies.delete('stateService')
    return this
  }

  withRedisService(ServiceClass: new () => ServiceInterface<'Redis'>): this {
    this.config.dependencies.redis = ServiceClass
    this.requiredDependencies.delete('redis')
    return this
  }

  // withPluginManagerService(
  //   ServiceClass: new () => ServiceInterface<'PluginManager'>
  // ): this {
  //   this.config.dependencies.pluginManager = ServiceClass
  //   this.requiredDependencies.delete('pluginManager')
  //   return this
  // }

  // withDatabaseService(
  //   ServiceClass: new () => ServiceInterface<'Database'>
  // ): this {
  //   this.config.dependencies.database = ServiceClass
  //   this.requiredDependencies.delete('database')
  //   return this
  // }

  withEventStoreService(
    ServiceClass: new () => ServiceInterface<'EventStore'>
  ): this {
    this.config.dependencies.eventStore = ServiceClass
    this.requiredDependencies.delete('eventStore')
    return this
  }

  withOptions(options: T & Partial<BaseConfig>): this {
    this.config.options = options
    return this
  }

  withDependencies(dependencies: BaseConfig): this {
    this.config.dependencies = dependencies
    return this
  }

  build(): AgentConfig<T> {
    // Add default dependencies for any missing required services
    for (const dependency of this.requiredDependencies) {
      console.warn(
        `Service ${dependency} not provided, using default implementation.`
      )

      if (!DEFAULT_DEPENDENCIES[dependency]) {
        throw new Error(`No default implementation found for ${dependency}`)
      }

      // @ts-ignore - This is safe because we've checked for the key above
      this.config.dependencies[dependency] = DEFAULT_DEPENDENCIES[dependency]
    }

    // Type assertion to ensure all required properties are present
    return this.config as AgentConfig<T>
  }
}
