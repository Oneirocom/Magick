import { Application as FeathersApplication } from '@feathersjs/koa'
import { IRegistry } from '@magickml/behave-graph'
import type { BasePlugin, EventPayload } from 'server/plugin'
import { SpellInterface } from 'server/schemas'
import { SpellCaster } from './spellCaster'
import isEqual from 'lodash/isEqual'
import { getLogger } from 'server/logger'
import { PluginManager } from 'server/pluginManager'
import { IAgentLogger } from 'server/agents'

interface IApplication extends FeathersApplication {
  service: any
}

interface IAgent extends IAgentLogger {
  id: string
  projectId: string
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
   * Map of spell runners for each spell id.
   * We use this to scale spell runners and to keep track of them.
   */
  private spellMap: Map<string, SpellCaster<Agent>[]> = new Map()

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
   * The main plugin manager.  This loads up all plugins in the plugin folder and provides
   * a unified registry for all plugins.
   * @example
   * this.pluginManager = new PluginManager(
   *   pluginDirectory,
   *   this.app.get('redis'),
   *   this.agent.id
   * );
   */
  private pluginManager!: PluginManager

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
  constructor({ app, agent }: { app: Application; agent: any }) {
    this.app = app
    this.agent = agent
    this.init()
  }

  init() {
    const pluginDirectory = process.env.PLUGIN_DIRECTORY || './plugins'
    this.pluginManager = new PluginManager(
      pluginDirectory,
      this.app.get('redis'),
      this.agent.id,
      this.app.get('pubsub')
    )

    // Initialize the plugins first
    this.initializePlugins()

    // Listen for spell changes
    this.app
      .service('spells')
      .on('updated', this.watchSpellUpdateHandler.bind(this))

    this.app
      .service('spells')
      .on('created', this.watchSpellCreatedHandler.bind(this))
  }

  /**
   * Handles watching spell updates that stream in from feathers server
   * @param {SpellInterface} spell - The spell that was updated.
   * @example
   * this.app.service('spells').on('updated', this.watchSpellHandler.bind(this));
   */
  private watchSpellUpdateHandler(spell: SpellInterface) {
    if (!this.watchSpells) return
    if (this.agent.projectId !== spell.projectId) return

    if (this.hasSpellCaster(spell.id)) {
      this.logger.debug(`Updating spell ${spell.id} in agent ${this.agent.id}`)
      this.updateSpell(spell)
      return
    }

    this.logger.debug(`Creating spell ${spell.id} in agent ${this.agent.id}`)
    this.loadSpell(spell)
  }

  /**
   * Handles watching spell creations that stream in from feathers server
   * @param {SpellInterface} spell - The spell that was created.
   * @example
   * this.app.service('spells').on('created', this.watchSpellHandler.bind(this));
   */
  private watchSpellCreatedHandler(spell: SpellInterface) {
    if (!this.watchSpells) return
    if (spell.type !== 'behave') return
    if (this.hasSpellCaster(spell.id)) return
    if (this.agent.projectId !== spell.projectId) return

    this.logger.debug(`Creating spell ${spell.id} in agent ${this.agent.id}`)
    this.loadSpell(spell)
  }

  /**
   * Initializes the plugins for the Spellbook.
   * We run over each plugin and initialize it.
   * We load the plugin into the spellbook for injection into each spellcaster.
   * We also use the plugin's event emitter to trigger events in the spellbook.
   */
  private initializePlugins() {
    // Load plugins
    this.pluginManager.loadPlugins().then(() => {
      this.logger.trace(
        `Plugins loaded in Spellbook for agent ${this.agent.id}`
      )
      this.pluginManager.getPlugins().forEach(plugin => {
        this.setupPluginWorker(plugin)
      })
    })
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
    this.logger.trace(`Setting up plugin worker for ${plugin.name}`)
    // Set up a Bull queue to process events from the plugin
    this.pluginManager.centralEventBus.on(plugin.eventQueueName, data => {
      this.handlePluginEvent(plugin.name, data.eventName, data)
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
    _payload: EventPayload
  ) {
    this.logger.trace(`Handling event ${eventName} for ${dependency}`)
    // Iterate over alll spell casters
    for (const [spellId, spellMap] of this.spellMap.entries()) {
      this.logger.trace(`Handling event ${eventName} for ${spellId}`)

      // Clone the payload so we don't mutate it when we pass it down to each spellcaster
      const payload = { ..._payload }

      // Get the first available spell runner
      const availableCaster = spellMap.find(runner => !runner.isBusy())
      if (availableCaster) {
        // Trigger the event in the spell runner
        availableCaster.handleEvent(dependency, eventName, payload)
        continue
      }

      // If there are no available spell runners, we create a new one
      const spellCaster = await this.loadById(spellId)

      if (!spellCaster) {
        this.agent.error(`Error handling event ${eventName} for ${spellId}`)
        continue
      }
      spellCaster?.handleEvent(dependency, eventName, payload)
    }
  }

  /**
   * Toggles the watchSpells flag.
   */
  toggleLive(data) {
    this.agent.log(`Toggling watchSpells to ${data.live}`)
    const { live } = data
    this.watchSpells = live ? live : !this.watchSpells
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
    this.logger.trace(`SPELLBOOK: Loading spells for agent ${this.agent.id}`)
    this.logger.trace(
      `SPELLBOOK: Spells: ${JSON.stringify(spells.map(s => s.id))}`
    )
    await Promise.all(spells.map(spell => this.loadSpell(spell)))
  }

  /**
   * Loads the spell runner for the given spell id.
   * @param {string} spellId - Id of the spell.
   * @returns {Promise<SpellCaster | undefined>} - Promise that resolves with the loaded spell runner instance or undefined if there was an error.
   * @example
   * const spellCaster= await spellbook.loadById(spellId);
   */
  async loadById(spellId: string): Promise<SpellCaster<Agent> | null> {
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
      console.log('Error!', error)
      this.logger.error(
        error,
        `SPELLBOOK: Error loading spell ${spellId} by id`
      )
      return null
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
  async loadSpell(spell: SpellInterface): Promise<SpellCaster<Agent> | null> {
    if (!spell) {
      this.agent?.error('No spell provided')
      console.error('No spell provided')
      return null
    }

    try {
      const spellCaster = new SpellCaster<Agent>({
        agent: this.agent,
        pluginManager: this.pluginManager,
        connection: this.app.get('redis'),
      })

      await spellCaster.initialize(spell)

      const spellCasterList = this.spellMap.get(spell.id)
      if (spellCasterList) {
        spellCasterList.push(spellCaster)
      } else {
        this.spellMap.set(spell.id, [spellCaster])
      }

      return spellCaster
    } catch (err) {
      console.log('ERROR', err)
      this.agent?.error(`Error loading spell ${spell.id}`)
      return null
    }
  }

  /**
   * Updates the spell runner for the given spell. Called from the watchSpellHandler.
   * @param {SpellInterface} spell - Spell instance.
   * @returns {Promise<void>} - Promise that resolves when the spell runner is updated.
   * @example
   * await spellbook.updateSpell(spell);
   */
  async updateSpell(spell: SpellInterface): Promise<void> {
    // clear out all instances of the spell
    this.clearSpellCasters(spell.id)
    // load the updated spell into memory
    this.loadSpell(spell)
  }

  /**
   * Returns a ready spell runner for the given spell id.
   * @param {string} spellId - Id of the spell.
   * @returns {SpellRunner | undefined} - Ready spell runner instance.
   * @example
   * const spellRunner = spellbook.getReadySpellRunner(spellId);
   */
  getReadySpellCaster(spellId: string): SpellCaster<Agent> | null {
    return this.spellMap.get(spellId)?.find(runner => !runner.isBusy()) || null
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
   * Clears the spell runners for the given spell id.
   * We run through all spellcasters held in memory and clear them.
   * This stops the loop, disposes the engine, and then deletes the spellcasters from the map.
   * @param {string} spellId - Id of the spell.
   * @example
   * spellbook.clearSpellCasters(spellId);
   */
  clearSpellCasters(spellId: string) {
    // go over each spellcaster and clear it
    const spellCasterList = this.spellMap.get(spellId)
    if (spellCasterList) {
      for (const spellCaster of spellCasterList) {
        spellCaster.dispose()
      }
    }
    this.spellMap.delete(spellId)
  }

  /**
   * Starts the spell runner for the given spell id.
   * Used by the agent to control the spell runner via commands.
   * @param {string} spellId - Id of the spell.
   */
  playSpell(data) {
    const { spellId } = data
    for (const spellCaster of this.spellMap.get(spellId) || []) {
      spellCaster.startRunLoop()
    }
  }

  /**
   * Stops the spell runner for the given spell id.
   * Used by the agent to control the spell runner via commands.
   * @param {string} spellId - Id of the spell.
   */
  pauseSpell(data) {
    const { spellId } = data
    for (const spellCaster of this.spellMap.get(spellId) || []) {
      spellCaster.stopRunLoop()
    }
  }

  /**
   * Cleans up the SpellManager instance.
   */
  onDestroy() {
    this.clear()
    //
    this.app
      .service('spells')
      .removeListener('updated', this.watchSpellUpdateHandler)

    this.app
      .service('spells')
      .removeListener('created', this.watchSpellCreatedHandler)
  }

  /**
   * Clears the spell runner map.
   */
  clear() {
    this.spellMap = new Map()
    this.pluginManager.centralEventBus.removeAllListeners()
  }
}
