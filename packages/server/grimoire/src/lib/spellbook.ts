import { EventEmitter } from 'events'
import { Application as FeathersApplication } from '@feathersjs/koa'
import {
  DefaultLogger,
  IRegistry,
  ManualLifecycleEventEmitter,
  registerCoreProfile,
} from '@magickml/behave-graph'
import type { BasePlugin, EventPayload } from 'server/plugin'
import { SpellInterface } from 'server/schemas'
import SpellCaster from './spellCaster'
import isEqual from 'lodash/isEqual'
import { getLogger } from 'server/logger'
import { BullMQWorker } from 'server/communication'

import { CoreRegistry, coreRegistry } from './coreRegistry'

interface IApplication extends FeathersApplication {
  service: any
}

interface IAgent {
  id: string
  error: (message: string) => void
}

/**
 * The `Spellbook` serves as the orchestrator within an event-driven architecture, 
 * managing the execution lifecycle of `SpellCasters`—dedicated executors for units 
 * of logic termed as spells. It adeptly assigns tasks to `SpellCasters` in response 
 * to events triggered by plugins, ensuring efficient resource management and responsiveness.
 * These spells casters are horizontally scalable, allowing for the execution of multiple
 * spells in parallel.
 *
 * Featuring real-time synchronization, the `Spellbook` enables dynamic spell updates,
 * reflecting changes instantaneously. This architecture not only bolsters modularity 
 * and scalability but also delineates a clear operational boundary within the application, 
 * paving the way for a robust and maintainable codebase.
 * 
 * @example
 * const spellbook = new Spellbook({
 * app,
 * agent,
 * plugins,
 * watchSpells: true,
 * });
 * 
 * @example
 * spellbook.loadSpells(spells);
 *  
 * @example
 * spellbook.updateSpell(spell);
 * 

 */
export class Spellbook<Agent extends IAgent, Application extends IApplication> {
  /**
   * Core registry.
   * This contains all the core dependencies for spellbook.
   * Includes primary handler for the core events magick handles.
   */
  private coreRegistry = new CoreRegistry().getRegistry()
  /**
   * Map of spell runners for each spell id.
   * We use this to scale spell runners and to keep track of them.
   */
  private spellMap: Map<string, SpellCaster<Agent>[]> = new Map()

  /**
   * Map of plugin event emitters.
   * We use this to trigger events in the first available spell runner.
   * @example
   * pluginEventEmitters = {
   *  'plugin1': new EventEmitter(),
   * 'plugin2': new EventEmitter(),
   * }
   * @example
   * pluginEventEmitters.get('plugin1').emit('event1', { payload: 'payload' });
   */
  private pluginEventEmitters: Map<string, EventEmitter>

  /**
   * Application instance.  Typed to main app.
   * @example
   * app.service('spells').on('updated', this.watchSpellHandler.bind(this));
   */
  private app: Application

  /**
   * Agent instance.
   */
  private agent: Agent

  /**
   * Array of plugins.
   * @example
   * plugins = [plugin1, plugin2];
   * @example
   * plugins.forEach(plugin => {
   *   this.registerPluginEventEmitter(plugin.name, plugin.eventEmitter);
   *   this.setupPluginWorker(plugin);
   * });
   */
  private plugins: BasePlugin[]

  /**
   * Flag to enable/disable watching spells.  We use this to keep the spells in sync with the server.
   * This is used when we are editing the spell live in the editor.
   * @example
   * watchSpells = true;
   * @example
   * this.app.service('spells').on('updated', this.watchSpellHandler.bind(this));
   * @example
   * watchSpellHandler(spell: SpellInterface) {
   *  if (!this.watchSpells) return;
   *  if (this.hasSpellCaster(spell.id)) {
   *    this.logger.debug(`Updating spell ${spell.id} in agent ${this.agent.id}`);
   *    this.updateSpell(spell);
   *  }
   * }
   */
  private watchSpells = false

  /**
   * Logger instance.
   */
  logger = getLogger()

  /**
   * Main registry.
   */
  mainRegistry!: IRegistry

  /**
   * Constructs a SpellManager.
   * @param app - The application instance.
   * @param agent - The agent instance.
   * @param plugins - Array of plugins.
   * @param socket - Optional socket for communication.
   * @param cache - Flag to enable/disable caching.
   * @param watchSpells - Flag to enable/disable watching spells.
   * @example
   * const spellManager = new SpellManager({
   *  app,
   *  agent,
   *  plugins,
   *  watchSpells: true,
   * });
   */
  constructor({
    app,
    agent,
    plugins,
  }: {
    app: Application
    agent: any
    plugins: BasePlugin[]
  }) {
    this.app = app
    this.agent = agent
    this.plugins = plugins
    this.pluginEventEmitters = new Map()
    this.initializePlugins()
    this.buildRegistry()
    this.app.service('spells').on('updated', this.watchSpellHandler.bind(this))
  }

  /**
   * Handles watching spell updates that stream in from feathers server
   * @param {SpellInterface} spell - The spell that was updated.
   * @example
   * this.app.service('spells').on('updated', this.watchSpellHandler.bind(this));
   */
  private watchSpellHandler(spell: SpellInterface) {
    if (!this.watchSpells) return
    if (this.hasSpellCaster(spell.id)) {
      this.logger.debug(`Updating spell ${spell.id} in agent ${this.agent.id}`)
      this.updateSpell(spell)
    }
  }

  /**
   * Cleans up the SpellManager instance.
   */
  onDestroy() {
    this.clear()
    //
    this.app.service('spells').removeListener('updated', this.watchSpellHandler)
  }

  /**
   * Clears the spell runner map.
   */
  clear() {
    this.spellMap = new Map()
  }

  /**
   * Loads the spell casters for the given spells.  We use this to load the spells when the agent starts.
   * With this new system, we no longer need a single root spell but all spells can process events in parallel.
   * @param {SpellInterface[]} spells - Array of spell instances.
   * @returns {Promise<void>} - Promise that resolves when the spells are loaded.
   * @example
   * await spellbook.loadSpells(spells);
   */
  async loadSpells(spells: SpellInterface[]) {
    await Promise.all(spells.map(spell => this.loadSpell(spell)))
  }

  /**
   * Loads the spell runner for the given spell id.
   * @param {string} spellId - Id of the spell.
   * @returns {Promise<SpellCaster | undefined>} - Promise that resolves with the loaded spell runner instance or undefined if there was an error.
   * @example
   * const spellCaster= await spellbook.loadById(spellId);
   */
  async loadById(spellId: string): Promise<SpellCaster<Agent> | undefined> {
    this.logger.debug(`Loading spell ${spellId}`)
    try {
      const spell = await this.app.service('spells').get(spellId)

      if (
        this.hasSpellCaster(spellId) &&
        this.getReadySpellCaster(spellId) &&
        isEqual(this.getReadySpellCaster(spellId)!.spell.graph, spell.graph)
      ) {
        return this.getReadySpellCaster(spellId)
      }

      this.logger.debug(`Reloading spell ${spellId}`)
      return this.loadSpell(spell)
    } catch (error) {
      this.logger.error(`Error loading spell ${spellId}: %o`, error)
      return
    }
  }

  /**
   * Loads the spell runner for the given spell.
   * @param {SpellInterface} spell - Spell instance.
   * @returns {Promise<SpellRunner | null>} - Promise that resolves with the loaded spell runner instance or undefined if there was an error.
   * @example
   * const spellCaster = await spellbook.load(spell);
   * @example
   * const spellCaster = await spellbook.load({
   *   id: 'spellId',
   *   graph: {},
   * });
   */
  async loadSpell(
    spell: SpellInterface
  ): Promise<SpellCaster<Agent> | undefined> {
    if (!spell) {
      this.agent?.error('No spell provided')
      console.error('No spell provided')
      return
    }

    const spellCaster = await new SpellCaster<Agent>({
      agent: this.agent,
    }).initialize(spell, this.mainRegistry)

    const spellCasterList = this.spellMap.get(spell.id)
    if (spellCasterList) {
      spellCasterList.push(spellCaster)
    } else {
      this.spellMap.set(spell.id, [spellCaster])
    }

    return spellCaster
  }

  /**
   * Updates the spell runner for the given spell.
   * @param {SpellInterface} spell - Spell instance.
   * @returns {Promise<void>} - Promise that resolves when the spell runner is updated.
   * @example
   * await spellbook.updateSpell(spell);
   */
  async updateSpell(spell: SpellInterface): Promise<void> {
    const spellCaster = this.getReadySpellCaster(spell.id)

    if (!spellCaster) {
      this.logger.warn(`No spell runner found for spell ${spell.id}`)
      await this.loadSpell(spell)
      return
    }

    // we need to go through every spellCaster and update it
    // todo monitor this for performance.  Might be easier to nuke the spellCasters and create a new one
    const spellCasterList = this.spellMap.get(spell.id)
    if (spellCasterList) {
      // we need to reinitialize the spellCaster
      spellCasterList.forEach(async runner => {
        await runner.initialize(spell, this.mainRegistry)
      })
    }
  }

  /**
   * Returns a ready spell runner for the given spell id.
   * @param {string} spellId - Id of the spell.
   * @returns {SpellRunner | undefined} - Ready spell runner instance.
   * @example
   * const spellRunner = spellbook.getReadySpellRunner(spellId);
   */
  getReadySpellCaster(spellId: string): SpellCaster<Agent> | undefined {
    return this.spellMap.get(spellId)?.find(runner => !runner.isBusy())
  }

  /**
   * Checks if the spell runner exists for the given spell id.
   * @param {string} spellId - Id of the spell.
   * @returns {boolean} - True if spell runner exists, false otherwise.
   * @example
   * const hasSpellRunner = spellbook.hasSpellRunner(spellId);
   */
  hasSpellCaster(spellId: string): boolean {
    return this.spellMap.has(spellId)
  }

  /**
   * Initializes the plugins for the Spellbook.
   * We run over each plugin and initialize it.
   * We load the plugin into the spellbook for injection into each spellcaster.
   * We also use the plugin's event emitter to trigger events in the spellbook.
   */
  private initializePlugins() {
    // Initialize each plugin
    this.plugins.forEach(plugin => {
      this.registerPluginEventEmitter(plugin.name, plugin.eventEmitter)
      this.setupPluginWorker(plugin)
    })
  }

  /**
   * Builds the registry for the Spellbook.
   * We start with an initial base registry.
   * We then combine each plugin's registry with the current combined registry.
   * Finally, we apply the core profile to the combined registry.
   * @returns {IRegistry} - The built registry.
   */
  private buildRegistry(): IRegistry {
    // Start with an initial base registry
    let combinedRegistry: IRegistry = this.coreRegistry

    // Combine each plugin's registry with the current combined registry
    this.plugins.forEach(plugin => {
      const pluginRegistry = plugin.getRegistry(combinedRegistry)
      combinedRegistry = {
        values: { ...combinedRegistry.values, ...pluginRegistry.values },
        nodes: { ...combinedRegistry.nodes, ...pluginRegistry.nodes },
        dependencies: {
          ...combinedRegistry.dependencies,
          ...pluginRegistry.dependencies,
        },
      }
    })

    // Finally, apply the core profile to the combined registry
    combinedRegistry = registerCoreProfile(combinedRegistry)

    this.mainRegistry = combinedRegistry

    return combinedRegistry
  }

  /**
   * Registers a plugin's event emitter.
   * @param {string} pluginName - Name of the plugin.
   * @param {EventEmitter} eventEmitter - Event emitter instance.
   * @example
   * this.registerPluginEventEmitter(plugin.name, plugin.eventEmitter);
   */
  private registerPluginEventEmitter(
    pluginName: string,
    eventEmitter: EventEmitter
  ) {
    // Register a plugin's event emitter
    this.pluginEventEmitters.set(pluginName, eventEmitter)
  }

  /**
   * Sets up a plugin's worker.  We map over the plugin's events and add them to the queue.
   * This will create an even isomorphism for the plugins between the agent and the spellbook.
   * When an even is received from the plugin, we trigger the event in the first available spell runner.
   * @param {BasePlugin} plugin - Plugin instance.
   * @example
   * this.setupPluginWorker(plugin);
   */
  private setupPluginWorker(plugin: BasePlugin) {
    // Set up a Bull queue to process events from the plugin
    const queue = new BullMQWorker<EventPayload>(this.app.get('redis'))
    queue.initialize(plugin.queueName, async job => {
      const { eventName } = job.data
      this.handlePluginEvent(plugin.name, eventName, job.data)
    })
  }

  /**
   * Runs through all spells in the spell book, find the first available one and triggers the event in it.
   * @param {string} eventName - Name of the event to trigger.
   * @param {any} payload - Payload of the event.
   * @example
   * this.triggerSpellEvent('myEvent', { data: 'example' });
   */
  private async handlePluginEvent(
    dependency: string,
    eventName: string,
    payload: EventPayload
  ) {
    // Iterate over alll spell casters
    for (const [spellId, spellMap] of this.spellMap.entries()) {
      // Get the first available spell runner
      const availableRunner = spellMap.find(runner => !runner.isBusy())
      if (availableRunner) {
        // Trigger the event in the spell runner
        availableRunner.handleEvent(dependency, eventName, payload)
        return
      }

      // If there are no available spell runners, we create a new one
      const spellCaster = await this.loadById(spellId)

      if (!spellCaster) {
        this.agent.error(`Error handling event ${eventName} for ${spellId}`)
        return
      }
      spellCaster?.handleEvent(dependency, eventName, payload)
    }
  }
}
