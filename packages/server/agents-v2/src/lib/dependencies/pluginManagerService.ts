import { Service } from '../core/service'
import { Plugin } from '../core/plugin'
import { Agent } from '../Agent'
import TypedEmitter from 'typed-emitter'
import { TYPES } from './index'

// Plugin Manager
export class PluginManager {
  private plugins: Map<string, Plugin<any>> = new Map()

  register<T extends Record<string, any>>(plugin: Plugin<T>): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already registered`)
    }
    this.plugins.set(plugin.name, plugin)
  }

  getPlugin<T extends Record<string, any>>(
    name: string
  ): Plugin<T> | undefined {
    return this.plugins.get(name)
  }

  getAllPlugins(): Plugin<any>[] {
    return Array.from(this.plugins.values())
  }

  getRegistry() {}
}

// modify the agents types to include functions and events added by the plugin manager
declare module '../Agent' {
  interface Agent {
    pluginManager: PluginManager
    registerPlugin<T extends Record<string, any>>(plugin: Plugin<T>): void
    getPlugin<T extends Record<string, any>>(
      name: string
    ): Plugin<T> | undefined
    getAllPlugins(): Plugin<any>[]
  }

  interface BaseAgentEvents {
    pluginRegistered: (pluginName: string) => void
    pluginInitialized: (pluginName: string) => void
  }
}

// Main Plugin Manager Middleware
export class PluginManagerService implements Service {
  apply(agent: Agent): void {
    const pluginManager = agent.resolve<PluginManager>(TYPES.PluginManager)
    agent.pluginManager = pluginManager

    agent.registerPlugin = plugin => {
      pluginManager.register(plugin)
      agent.emit('pluginRegistered', plugin.name)

      // Extend agent's event emitter with plugin's events
      const extendedAgent = agent as Agent & TypedEmitter<typeof plugin.events>
      Object.entries(plugin.events).forEach(([eventName, eventHandler]) => {
        extendedAgent.on(
          eventName as keyof typeof plugin.events,
          eventHandler as never
        )
      })

      if (plugin.initialize) {
        Promise.resolve(plugin.initialize(agent)).then(() => {
          agent.emit('pluginInitialized', plugin.name)
        })
      }
    }

    agent.getPlugin = (name: string) => pluginManager.getPlugin(name)
    agent.getAllPlugins = () => pluginManager.getAllPlugins()
  }
}
