import * as Bull from 'bullmq'
import { EventEmitter } from 'events'
import SpellCaster from './spellCaster'
import { BasePlugin, EventFormat } from 'shared/plugin'
import {
  BullQueue,
  type Application,
  type SpellInterface,
  BullMQWorker,
} from 'server/core'
import { Agent } from 'server/agents'
import isEqual from 'lodash/isEqual'
import { getLogger } from 'shared/core'

/**
 * Manages spell runners and handles events from plugins.
 */
class Spellbook {
  /**
   * Map of spell runners for each spell id.
   * We use this to scale spell runners and to keep track of them.
   */
  private spellCasterMap: Map<string, SpellCaster[]> = new Map()

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
  watchSpells: boolean
  /**
   * Logger instance.
   */
  logger = getLogger()

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
    watchSpells = false,
  }: {
    app: Application
    agent: any
    plugins: BasePlugin[]
    watchSpells?: boolean
  }) {
    this.app = app
    this.agent = agent
    this.plugins = plugins
    this.watchSpells = watchSpells
    this.pluginEventEmitters = new Map()
    this.initializePlugins()
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
    this.spellCasterMap = new Map()
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
      await this.load(spell)
      return
    }

    // we need to go through every spellCaster and update it
    // todo monitor this for performance.  Might be easier to nuke the spellCasters and create a new one
    const spellCasterList = this.spellCasterMap.get(spell.id)
    if (spellCasterList) {
      spellCasterList.forEach(async caster => {
        await caster.loadSpell(spell)
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
  getReadySpellCaster(spellId: string): SpellCaster | undefined {
    return this.spellCasterMap.get(spellId)?.find(runner => !runner.isBusy())
  }

  /**
   * Checks if the spell runner exists for the given spell id.
   * @param {string} spellId - Id of the spell.
   * @returns {boolean} - True if spell runner exists, false otherwise.
   * @example
   * const hasSpellRunner = spellbook.hasSpellRunner(spellId);
   */
  hasSpellCaster(spellId: string): boolean {
    return this.spellCasterMap.has(spellId)
  }

  /**
   * Loads the spell runner for the given spell id.
   * @param {string} spellId - Id of the spell.
   * @returns {Promise<SpellCaster | undefined>} - Promise that resolves with the loaded spell runner instance or undefined if there was an error.
   * @example
   * const spellCaster= await spellbook.loadById(spellId);
   */
  async loadById(spellId: string): Promise<SpellCaster | undefined> {
    this.logger.debug(`Loading spell ${spellId}`)
    try {
      const spell = await this.app.service('spells').get(spellId)

      if (
        this.hasSpellCaster(spellId) &&
        this.getReadySpellCaster(spellId) &&
        isEqual(
          this.getReadySpellCaster(spellId)!.currentSpell.graph,
          spell.graph
        )
      ) {
        return this.getReadySpellCaster(spellId)
      }

      this.logger.debug(`Reloading spell ${spellId}`)
      return this.load(spell)
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
  async load(spell: SpellInterface): Promise<SpellCaster | undefined> {
    if (!spell) {
      this.agent?.error('No spell provided')
      console.error('No spell provided')
      return
    }

    const spellCaster = new SpellCaster({
      app: this.app,
      agent: this.agent,
      spellbook: this,
    })

    await spellCaster.loadSpell(spell)

    const spellCasterList = this.spellCasterMap.get(spell.id)
    if (spellCasterList) {
      spellCasterList.push(spellCaster)
    } else {
      this.spellCasterMap.set(spell.id, [spellCaster])
    }

    return spellCaster
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
    const queue = new BullMQWorker()
    queue.initialize(plugin.name, async job => {
      const { eventName, payload } = job.data
      this.triggerSpellEvent(eventName, payload)
    })
  }

  /**
   * Triggers an event in the first available spell runner.
   * @param {string} eventName - Name of the event to trigger.
   * @param {any} payload - Payload of the event.
   * @example
   * this.triggerSpellEvent('myEvent', { data: 'example' });
   */
  private triggerSpellEvent(eventName: string, payload: EventFormat) {
    // Trigger an event in the first available spell runner
    const availableRunner = this.getAvailableSpellCaster()
    if (availableRunner) {
      availableRunner.handleEvent(eventName, payload)
    } else {
      const newRunner = this.createSpellCaster()
      newRunner.handleEvent(eventName, payload)
    }
  }

  private getAvailableSpellCaster(): SpellCaster | undefined {
    // Get the first available spell runner
    for (const runners of this.spellCasterMap.values()) {
      const availableRunner = runners.find(runner => !runner.isBusy())
      if (availableRunner) {
        return availableRunner
      }
    }
    return undefined
  }

  private createSpellCaster(): SpellCaster {
    // Create a new spell runner instance
    const newCaster = new SpellCaster(/* ... */)
    // Add newCaster to spellCasterMap and other necessary setups
    return newCaster
  }
}

export default Spellbook
