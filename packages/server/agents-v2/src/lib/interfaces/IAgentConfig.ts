import { AgentConfigOptions } from '../Agent'
import { ConfigToDependencyMap } from './IDependencies'

// Now, let's generate our BaseConfig from this map:
export type BaseConfig = {
  [K in keyof ConfigToDependencyMap]: new () => ConfigToDependencyMap[K]
}

// Main configuration object for the agent
export interface AgentConfig<T = AgentConfigOptions> {
  dependencies: BaseConfig
  options: T & {
    worldId: string
    agentId: string
  }
}
