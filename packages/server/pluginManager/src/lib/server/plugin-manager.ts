import fs from 'fs'
import path from 'path'
import { EventEmitter } from 'events'
import { BasePlugin } from 'server/plugin'
import { IRegistry } from '@magickml/behave-graph'

/**
 * Manages the lifecycle of plugins, their events, and maintains a unified registry.
 */
class PluginManager extends EventEmitter {
  private plugins: Map<string, BasePlugin>
  private pluginDirectory: string

  constructor(pluginDirectory: string) {
    super()
    this.pluginDirectory = pluginDirectory
    this.plugins = new Map()
  }

  /**
   * Loads and initializes plugins from the specified directory.
   */
  async loadPlugins(): Promise<void> {
    const pluginFolders = fs
      .readdirSync(this.pluginDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    for (const folder of pluginFolders) {
      const pluginConfigPath = path.join(
        this.pluginDirectory,
        folder,
        'config.json'
      )
      if (fs.existsSync(pluginConfigPath)) {
        const config = JSON.parse(fs.readFileSync(pluginConfigPath, 'utf-8'))
        const pluginPath = path.join(this.pluginDirectory, folder, config.main)
        const PluginClass = await import(pluginPath)
        const pluginInstance = new PluginClass.default(config)
        this.registerPlugin(pluginInstance)
      }
    }
  }

  /**
   * Registers a plugin with the Plugin Manager.
   * @param plugin The plugin instance to register.
   */
  registerPlugin(plugin: BasePlugin): void {
    this.plugins.set(plugin.name, plugin)
    this.setupPluginEventForwarding(plugin)
    plugin.init()
  }

  /**
   * Sets up event forwarding from a plugin to the Plugin Manager's event emitter.
   * @param plugin The plugin from which to forward events.
   */
  private setupPluginEventForwarding(plugin: BasePlugin): void {
    plugin.eventEmitter.on('event', eventData => {
      this.emit('pluginEvent', plugin.name, eventData)
    })
  }

  /**
   * Retrieves a unified registry of all nodes, values, and dependencies from the plugins.
   * @returns A unified registry object.
   */
  getUnifiedRegistry(): IRegistry {
    const unifiedRegistry: IRegistry = {
      nodes: {},
      values: {},
      dependencies: {},
    }

    for (const plugin of this.plugins.values()) {
      const { nodes, values, dependencies } =
        plugin.getRegistry(unifiedRegistry)
      Object.assign(unifiedRegistry.nodes, nodes)
      Object.assign(unifiedRegistry.values, values)
      Object.assign(unifiedRegistry.dependencies, dependencies)
    }

    return unifiedRegistry
  }

  /**
   * Activates a plugin, making it ready for operation.
   * @param pluginName The name of the plugin to activate.
   */
  activatePlugin(pluginName: string): void {
    const plugin = this.plugins.get(pluginName)
    if (plugin) {
      plugin.activate()
    } else {
      console.warn(`Plugin ${pluginName} not found for activation.`)
    }
  }

  /**
   * Deactivates a plugin, putting it in a passive state.
   * @param pluginName The name of the plugin to deactivate.
   */
  deactivatePlugin(pluginName: string): void {
    const plugin = this.plugins.get(pluginName)
    if (plugin) {
      plugin.deactivate()
    } else {
      console.warn(`Plugin ${pluginName} not found for deactivation.`)
    }
  }

  /**
   * Unloads a plugin, removing it from the system.
   * @param pluginName The name of the plugin to unload.
   */
  unloadPlugin(pluginName: string): void {
    const plugin = this.plugins.get(pluginName)
    if (plugin) {
      plugin.destroy()
      this.plugins.delete(pluginName)
    } else {
      console.warn(`Plugin ${pluginName} not found for unloading.`)
    }
  }

  // Additional methods for handling activation, deactivation, and unloading of plugins...
}

export default PluginManager
