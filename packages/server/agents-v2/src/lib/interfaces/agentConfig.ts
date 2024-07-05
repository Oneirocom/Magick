import { Service } from '../core/service'
import {
  ConfigServiceType,
  ConfigToServiceMapping,
  ServiceInterface,
} from './types'

/**
 * Main configuration object for the agent
 */
export interface AgentConfig<T = Record<string, any>> {
  coreServices: {
    [K in ConfigServiceType]?: new () => Service<
      ServiceInterface<ConfigToServiceMapping[K]>
    >
  }
  additionalServices: Map<string, new () => Service<any>>
  // Stand in for now
  // database: () => Service<ServiceInterface<any>>
  options: T
}
