import { IRegistry, NodeDefinition, ValueType } from '@magickml/behave-graph'
import { Agent } from '../Agent' // Adjust import paths as necessary
import { TypedEmitter } from 'tiny-typed-emitter'

// Base Plugin class
// Define the types for events a plugin might handle
interface PluginEvents {
  [event: string]: (...args: any[]) => void
}

// Base Plugin class with registry management and lifecycle methods
export abstract class Plugin<T extends PluginEvents> extends TypedEmitter<T> {
  name: string
  version: string
  nodes: NodeDefinition[] = []
  values: ValueType[] = []
  events: T

  constructor(name: string, version: string, events: T) {
    super()
    this.name = name
    this.version = version
    this.events = events // Assuming events are managed by TypedEmitter
  }

  // Lifecycle methods that can be optionally implemented by subclasses
  initialize?(agent: Agent): void | Promise<void>
  cleanup?(agent: Agent): void | Promise<void>

  // Method to get the plugin's specific registry, should be implemented by subclasses if custom behavior is needed
  async getRegistry(
    agent: Agent,
    existingRegistry: IRegistry = { values: {}, nodes: {}, dependencies: {} }
  ): Promise<IRegistry> {
    const pluginValues = Object.fromEntries(this.values.map(v => [v.name, v]))
    const pluginNodes = Object.fromEntries(this.nodes.map(n => [n.typeName, n]))
    const pluginDependencies = this.getDependencies
      ? this.getDependencies(agent)
      : {}

    // Merge the plugin's specific configurations with the existing registry
    const registry = {
      values: { ...existingRegistry.values, ...pluginValues },
      nodes: { ...existingRegistry.nodes, ...pluginNodes },
      dependencies: { ...existingRegistry.dependencies, ...pluginDependencies },
    }
    return registry
  }

  // Subclasses should provide their specific dependencies
  getDependencies?(spellCaster: any): Record<string, any>
}

export default Plugin

// Define the type for the configuration object of createPlugin function
interface CreatePluginConfig<T extends PluginEvents> {
  name: string
  version: string
  nodes?: NodeDefinition[]
  values?: ValueType[]
  provideDependencies?: (agent: Agent) => Record<string, any>
  getRegistry?: (
    agent: Agent,
    existingRegistry?: IRegistry
  ) => Promise<IRegistry>
  events: T
  initialize?: (agent: Agent) => void | Promise<void>
  cleanup?: (agent: Agent) => void | Promise<void>
  dependencies?: Record<string, any>
}

// Factory function to create a new Plugin instance
export function createPlugin<T extends PluginEvents>(
  config: CreatePluginConfig<T>
): Plugin<T> {
  const {
    name,
    version,
    events,
    initialize,
    cleanup,
    nodes = [],
    values = [],
    provideDependencies = () => ({}),
    getRegistry = async (
      agent: Agent,
      existingRegistry: IRegistry = { values: {}, nodes: {}, dependencies: {} }
    ) => {
      // Default getRegistry implementation
      const pluginValues = Object.fromEntries(values.map(v => [v.name, v]))
      const pluginNodes = Object.fromEntries(nodes.map(n => [n.typeName, n]))
      const pluginDependencies = provideDependencies(agent)

      // Merge with existing registry
      const registry = {
        values: { ...existingRegistry.values, ...pluginValues },
        nodes: { ...existingRegistry.nodes, ...pluginNodes },
        dependencies: {
          ...existingRegistry.dependencies,
          ...pluginDependencies,
        },
      }
      return registry
    },
  } = config

  class CustomPlugin extends Plugin<T> {
    constructor() {
      super(name, version, events)
    }

    initialize(agent: Agent): void | Promise<void> {
      if (initialize) {
        return initialize(agent)
      }
    }

    cleanup(agent: Agent): void | Promise<void> {
      if (cleanup) {
        return cleanup(agent)
      }
    }

    async getRegistry(
      agent: Agent,
      existingRegistry: IRegistry
    ): Promise<IRegistry> {
      return getRegistry(agent, existingRegistry)
    }
  }

  return new CustomPlugin()
}
