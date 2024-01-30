import { Application as FeathersApplication } from '@feathersjs/koa'
import { IRegistry } from '@magickml/behave-graph'
import type { BasePlugin, EventPayload } from 'server/plugin'
import { SpellInterface } from 'server/schemas'
import { SpellCaster } from './spellCaster'
import isEqual from 'lodash/isEqual'
import { getLogger } from 'server/logger'
import { PluginManager } from 'server/pluginManager'
import { IAgentLogger } from 'server/agents'
import { type CommandHub } from 'server/command-hub'
import { AGENT_SPELL_STATE } from 'communication'
import { RedisPubSub } from 'server/redis-pubsub'

interface IApplication extends FeathersApplication {
  service: any
}

interface IAgent extends IAgentLogger {
  id: string
  projectId: string
  currentSpellReleaseId: string | null
  pubsub: RedisPubSub
}

export type SpellState = {
  isRunning: boolean
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

  private stateMap: Map<string, SpellState> = new Map()

  private commandHub: CommandHub

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
  private pluginManager: PluginManager

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

  get isLive() {
    return this.watchSpells && this.spellMap.size > 0
  }

  get initialState() {
    return {
      isRunning: true,
    }
  }

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
    pluginManager,
    commandHub,
  }: {
    app: Application
    agent: any
    pluginManager: PluginManager
    commandHub: CommandHub
  }) {
    this.pluginManager = pluginManager
    this.commandHub = commandHub
    this.app = app
    this.agent = agent
    this.init()
  }

  init() {
    // Initialize the plugins first
    this.initializePlugins()
    this.initializeCommands()

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
   * Updates the spell state for the given spell id.
   * @param {string} spellId - Id of the spell.
   * @param {Partial<SpellState>} update - Partial update to the spell state.
   * @example
   * spellbook.updateSpellState(spellId, { isRunning: true });
   */
  updateSpellState(spellId: string, update: Partial<SpellState>) {
    const state = this.stateMap.get(spellId) || { isRunning: false }
    this.stateMap.set(spellId, { ...state, ...update })
  }

  /**
   * Initializes the commands for the Spellbook.  These can be sent by the agentCommander
   * to control the spellbook.
   *
   */
  initializeCommands() {
    this.commandHub.registerDomain('agent', 'spellbook', {
      toggleLive: this.toggleLive.bind(this),
      pauseSpell: this.pauseSpell.bind(this),
      playSpell: this.playSpell.bind(this),
      killSpell: this.killSpell.bind(this),
      killSpells: this.killSpells.bind(this),
      syncState: this.syncState.bind(this),
      refreshSpells: this.refreshSpells.bind(this),
    })
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
      if (_payload.isPlaytest && spellId !== _payload?.spellId) continue

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
   * Syncs the state of the spell with the server.
   * @param {any} data - Data payload.
   * @example
   * this.syncState(data);
   */
  syncState(data) {
    const { spellId } = data

    if (!this.hasSpellCaster(spellId)) return

    const state = this.stateMap.get(spellId)

    if (!state) return

    this.agent.pubsub.publish(AGENT_SPELL_STATE(this.agent.id), {
      spellId,
      state,
    })
  }

  async refreshSpells() {
    this.clearAllSpellCasters()
    this.resetAllSpellCasterStates()

    const spellsData = await this.app.service('spells').find({
      query: {
        projectId: this.agent.projectId,
        type: 'behave',
        spellReleaseId: this.agent.currentSpellReleaseId || 'null',
      },
    })
    this.loadSpells(spellsData.data)
  }

  /**
   * Toggles the watchSpells flag.
   */
  toggleLive(data) {
    this.logger.trace(`Toggling watchSpells to ${data.live}`)
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
    if (!spells) {
      this.logger.error(
        `SPELLBOOK: No spells provided for agent ${this.agent.id}`
      )
      return
    }
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

    const initialState = this.stateMap.get(spell.id) || this.initialState

    try {
      const spellCaster = new SpellCaster<Agent>({
        agent: this.agent,
        pluginManager: this.pluginManager,
        connection: this.app.get('redis'),
        initialState,
      })

      spellCaster.initialize(spell)

      const spellCasterList = this.spellMap.get(spell.id)
      if (spellCasterList) {
        spellCasterList.push(spellCaster)
      } else {
        this.spellMap.set(spell.id, [spellCaster])
        this.stateMap.set(spell.id, { isRunning: true })
      }

      return spellCaster
    } catch (err) {
      console.log('ERROR', err)
      this.agent?.error(`Error loading spell ${spell.id}`)
      return null
    }
  }

  /**bas
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
    this.stateMap.delete(spellId)
  }

  /**
   * Resets the spell runner states for the given spell id.
   * This will go into the state service and wipe all keys from memory.
   * @param {string} spellId - Id of the spell.
   */
  resetSpellCasterStates(spellId: string) {
    const spellCasterList = this.spellMap.get(spellId)
    if (spellCasterList) {
      for (const spellCaster of spellCasterList) {
        spellCaster.resetState()
      }
    }
  }

  /**
   * Clears all spell runners.
   * We run through all spellcasters held in memory and clear them.
   * This stops the loop, disposes the engine, and then deletes the spellcasters from the map.
   */
  clearAllSpellCasters() {
    // go over each spellcaster and clear it
    for (const spellCasterList of this.spellMap.values()) {
      for (const spellCaster of spellCasterList) {
        spellCaster.dispose()
      }
    }
    this.spellMap.clear()
    this.stateMap.clear()
  }

  /*
   * Resets all spell runner states.
   * This will go into the state service and wipe all keys from memory.
   */
  resetAllSpellCasterStates() {
    for (const spellCasterList of this.spellMap.values()) {
      for (const spellCaster of spellCasterList) {
        spellCaster.resetState()
      }
    }
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
    this.updateSpellState(spellId, { isRunning: true })
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
    this.updateSpellState(spellId, { isRunning: false })
  }

  /**
   * Kills the spell runner for the given spell id.
   * Used by the agent to control the spell runner via commands.
   * @param {string} spellId - Id of the spell.
   * @example
   * spellbook.killSpell(spellId);
   */
  killSpells() {
    this.agent.log(`Killing all spells in agent ${this.agent.id}`)
    this.clearAllSpellCasters()
    this.resetAllSpellCasterStates()
  }

  /**
   * Kills the spell runner for the given spell id.
   * Used by the agent to control the spell runner via commands.
   * @param {string} spellId - Id of the spell.
   * @example
   * spellbook.killSpell(spellId);
   */
  killSpell(data) {
    const { spellId } = data
    this.agent.log(`Killing spell ${spellId} in agent ${this.agent.id}`)
    this.clearSpellCasters(spellId)
    this.resetSpellCasterStates(spellId)
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
    this.stateMap = new Map()
    this.pluginManager.centralEventBus.removeAllListeners()
  }
}
