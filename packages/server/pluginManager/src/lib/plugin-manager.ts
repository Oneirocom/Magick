import fs from 'fs'
import path from 'path'
import { EventEmitter } from 'events'
import { CorePlugin } from 'server/plugin'
import { IRegistry } from '@magickml/behave-graph'
import pino from 'pino'
import { getLogger } from 'server/logger'

/**
 * Manages the lifecycle of plugins, their events, and maintains a unified registry.
 */
class PluginManager extends EventEmitter {
  /**
   * The map of plugins, keyed by name.
   * @private
   * @type {Map<string, CorePlugin>}
   */
  private plugins: Map<string, CorePlugin>

  /**
   * The directory where plugins are located.
   * @private
   * @type {string}
   */
  private pluginDirectory: string

  /**
   * The logger instance.
   * @private
   * @type {pino.Logger}
   */
  private logger: pino.Logger

  /**
   * The central event bus for the plugin manager.
   * We use this to relay events throughout the plugins.
   * @type {EventEmitter}
   * @memberof PluginManager
   * @example
   * ```typescript
   *
   * // Listen for events
   * pluginManager.centralEventBus.on('event', (pluginName, eventData) => {
   *  // Do something with the event
   * })
   *
   * // Emit an event
   * pluginManager.centralEventBus.emit('event', 'pluginName', { foo: 'bar' })
   *
   * // Emit an event from a plugin
   * this.centralEventBud.emit('event', { foo: 'bar' })
   *
   * ```
   */
  centralEventBus: EventEmitter = new EventEmitter()

  /**
   * Creates an instance of PluginManager.
   * @param {string} pluginDirectory The directory where plugins are located.
   * @memberof PluginManager
   */
  constructor(pluginDirectory: string) {
    super()
    this.pluginDirectory = pluginDirectory
    this.plugins = new Map()
    this.logger = getLogger()
  }

  /**
   * Returns a list of plugins.
   * @returns {CorePlugin[]} An array of plugins.
   * @memberof PluginManager
   */
  getPlugins(): CorePlugin[] {
    return Array.from(this.plugins.values())
  }

  /**
   * Loads plugins from the plugin directory and registeres them.
   * @memberof PluginManager
   */
  async loadPlugins(): Promise<void> {
    this.logger.debug('Loading plugins from %s', this.pluginDirectory)
    const pluginFolders = fs
      .readdirSync(this.pluginDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    this.logger.debug(pluginFolders, 'Found plugin folders')

    for (const folder of pluginFolders) {
      const pluginConfigPath = path.join(
        this.pluginDirectory,
        folder,
        'config.json'
      )
      if (fs.existsSync(pluginConfigPath)) {
        const config = JSON.parse(fs.readFileSync(pluginConfigPath, 'utf-8'))
        const pluginPath = path.join(this.pluginDirectory, folder, config.main)
        const PluginClassPackage = await import(pluginPath)
        const pluginInstance = new PluginClassPackage.default(config)
        this.registerPlugin(pluginInstance)
      }
    }
  }

  /**
   * Registers a plugin with the Plugin Manager.
   * @param plugin The plugin instance to register.
   */
  registerPlugin(plugin: CorePlugin): void {
    this.logger.debug('Registering plugin %s', plugin.name)
    this.plugins.set(plugin.name, plugin)
    this.setupPluginEventForwarding(plugin)
    plugin.init(this.centralEventBus)
  }

  /**
   * Sets up event forwarding from a plugin to the Plugin Manager's event emitter.
   * @param plugin The plugin from which to forward events.
   */
  private setupPluginEventForwarding(plugin: CorePlugin): void {
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
      this.logger.debug(`Plugin ${pluginName} activated`)
    } else {
      this.logger.warn(`Plugin ${pluginName} not found for activation.`)
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
      this.logger.debug(`Plugin ${pluginName} deactivated`)
    } else {
      this.logger.warn(`Plugin ${pluginName} not found for deactivation.`)
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
      this.logger.debug(`Plugin ${pluginName} unloaded`)
    } else {
      this.logger.warn(`Plugin ${pluginName} not found for unloading.`)
    }
  }

  // Additional methods for handling activation, deactivation, and unloading of plugins...
}

export default PluginManager
