import fs from 'fs'
import path from 'path'
import { EventEmitter } from 'events'
import { BasePlugin } from 'server/plugin'
import { IRegistry } from '@magickml/behave-graph'
import pino from 'pino'
import { getLogger } from 'server/logger'
import Redis from 'ioredis'
import * as plugins from './../../../../../plugins'
import { RedisPubSub } from 'server/redis-pubsub'
import { SpellCaster } from 'packages/server/grimoire/src/lib/spellCaster'

/**
 * Manages the lifecycle of plugins, their events, and maintains a unified registry.
 */
export class PluginManager extends EventEmitter {
  /**
   * The Redis connection.
   * @private
   * @type {Redis}
   */
  private connection: Redis

  /**
   * The Redis PubSub connection.
   * @private
   * @type {RedisPubSub}
   */
  private pubSub: RedisPubSub

  /**
   * The map of plugins, keyed by name.
   * @private
   * @type {Map<string, BasePlugin>}
   */
  private plugins: Map<string, BasePlugin>

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
   * The agent ID of the agent running the plugin manager.
   * @type {string}
   * @memberof PluginManager
   */
  agentId: string

  /**
   * Creates an instance of PluginManager.
   * @param {string} pluginDirectory The directory where plugins are located.
   * @param {Redis} connection The Redis connection.
   * @param {string} agentId The agent ID of the agent running the plugin manager.
   * @example
   * ```typescript
   * const pluginManager = new PluginManager(
   *   path.join(__dirname, 'plugins'),
   *   redisConnection,
   *   agentId
   * )
   * @memberof PluginManager
   */

  projectId: string
  constructor({
    pluginDirectory,
    connection,
    agentId,
    pubSub,
    projectId,
  }: {
    pluginDirectory: string
    connection: Redis
    agentId: string
    pubSub: RedisPubSub
    projectId: string
  }) {
    super()
    this.agentId = agentId
    this.projectId = projectId
    this.pubSub = pubSub
    this.connection = connection
    this.pluginDirectory = pluginDirectory
    this.plugins = new Map()
    this.logger = getLogger()
  }

  /**
   * Returns a list of plugins.
   * @returns {BasePlugin[]} An array of plugins.
   * @memberof PluginManager
   */
  getPlugins(): BasePlugin[] {
    return Array.from(this.plugins.values())
  }

  /**
   * Loads plugins from the plugin directory and registers them.
   *
   */
  async loadPlugins(): Promise<void> {
    for (const [, pluginGetter] of Object.entries(plugins)) {
      // Get the actual class from the getter
      const PluginClass = pluginGetter

      // Check if PluginClass extends BasePlugin
      // This check assumes BasePlugin is the base class for all your plugins
      if (
        Object.getPrototypeOf(PluginClass) === BasePlugin.prototype ||
        // @ts-ignore
        PluginClass.prototype instanceof BasePlugin
      ) {
        // Create an instance of the plugin
        // @ts-ignore
        const pluginInstance = new PluginClass({
          agentId: this.agentId,
          connection: this.connection,
          pubSub: this.pubSub,
          projectId: this.projectId,
        })
        this.registerPlugin(pluginInstance)
      }
    }
  }

  /**
   * Loads plugins from the plugin directory and registers them.
   * @memberof PluginManager
   */
  async loadPluginsDynamic(): Promise<void> {
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
        const packageName = config.packageName
        this.logger.debug(`PLUGIN-MANAGER: loading package ${packageName}`)

        try {
          // eslint-disable-next-line
          const PluginClassPackage = require(packageName)
          // const PluginClassPackage = await import(packageName)
          const pluginInstance = new PluginClassPackage.default(config)
          this.registerPlugin(pluginInstance)
        } catch (err) {
          this.logger.error(
            err,
            `PLUGIN-MANAGER: error loading package ${packageName}`
          )
        }
      }
    }
  }

  /**
   * Registers a plugin with the Plugin Manager.
   * @param plugin The plugin instance to register.
   */
  registerPlugin(plugin: BasePlugin): void {
    this.logger.debug(`Registering plugin ${plugin.name}`)
    this.plugins.set(plugin.name, plugin)
    this.setupPluginEventForwarding(plugin)
    plugin.init(this.centralEventBus)
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
  async getRegistry(
    spellCaster: SpellCaster,
    baseRegistry?: IRegistry
  ): Promise<IRegistry> {
    const unifiedRegistry: IRegistry = baseRegistry || {
      nodes: {},
      values: {},
      dependencies: {},
    }

    for (const plugin of this.plugins.values()) {
      const { nodes, values, dependencies } = await plugin.getRegistry(
        unifiedRegistry,
        spellCaster
      )
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

  /**
   * Cleans up resources and performs necessary teardown tasks before destroying the PluginManager instance.
   */
  async onDestroy(): Promise<void> {
    this.logger.debug('Destroying PluginManager and cleaning up resources')

    // Unload all plugins
    for (const pluginName of this.plugins.keys()) {
      this.unloadPlugin(pluginName)
    }

    // Remove all listeners from the central event bus
    this.centralEventBus.removeAllListeners()

    // Remove all listeners from this instance of PluginManager (if any)
    this.removeAllListeners()

    this.logger.debug('PluginManager destroyed')
  }

  // /**
  //  * Method to enable/disable a specific plugin.
  //  * @param pluginName - The name of the plugin to enable/disable.
  //  * @param enable - Boolean indicating whether to enable or disable the plugin.
  //  */
  // setPluginStatus(pluginName: string, enable: boolean): void {
  //   const plugin = this.plugins.get(pluginName)
  //   if (plugin) {
  //     plugin.handleEnableCommand(enable)
  //     this.logger.debug(
  //       `Plugin ${pluginName} ${enable ? 'enabled' : 'disabled'}`
  //     )
  //   } else {
  //     this.logger.warn(`Plugin ${pluginName} not found for status change.`)
  //   }
  // }

  // /**
  //  * Method to get the status of a specific plugin.
  //  * @param pluginName - The name of the plugin to check the status of.
  //  * @returns The status of the plugin (enabled/disabled).
  //  */
  // getPluginStatus(pluginName: string): boolean | null {
  //   const plugin = this.plugins.get(pluginName)
  //   if (plugin) {
  //     return plugin.getStatus()
  //   } else {
  //     this.logger.warn(`Plugin ${pluginName} not found for status check.`)
  //     return null
  //   }
  // }
}
