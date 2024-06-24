import { Application as FeathersApplication } from '@feathersjs/koa'
import { IRegistry } from '@magickml/behave-graph'
import type { BasePlugin } from 'server/plugin'
import { EventPayload, ISharedAgent } from 'servicesShared'
import { SpellInterface } from 'server/schemas'
import { SpellCaster } from './spellCaster'
import { getLogger } from 'server/logger'
import { PluginManager } from 'server/pluginManager'
import { type CommandHub } from 'server/command-hub'
import { AGENT_SPELL_STATE } from 'communication'
import { PrismaClient } from '@magickml/server-db'

interface IApplication extends FeathersApplication {
  service: any
}

export type SpellState = {
  isRunning: boolean
  debug: boolean
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
export class Spellbook<
  Application extends IApplication,
  A extends ISharedAgent
> {
  /**
   * Map of spell runners for each spell id stored by event channel
   * We use this to scale spell runners and to keep track of them.
   */
  private eventMap: Map<string, Map<string, SpellCaster<A>>> = new Map()
  private spells: Map<string, SpellInterface> = new Map()

  private commandHub: CommandHub<A>

  private prisma: PrismaClient

  /**
   * Application instance.  Typed to main app.
   * @example
   * app.service('spells').on('updated', this.watchSpellHandler.bind(this));
   */
  private app: Application

  /**
   * Agent instance.
   */
  private agent: A

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
  private pluginManager: PluginManager<A>

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
    return this.watchSpells
  }

  get initialState() {
    return {
      isRunning: true,
      debug: true,
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
    pluginManager: PluginManager<A>
    commandHub: CommandHub<A>
  }) {
    this.pluginManager = pluginManager
    this.commandHub = commandHub
    this.app = app
    this.agent = agent
    this.prisma = new PrismaClient()
    this.init()
    this.pluginManager.on('pluginsLoaded', () => {
      this.initializePlugins()
    })
  }

  init() {
    // Initialize the plugins first
    this.initializePlugins()
    this.initializeCommands()
    this.initializeChannels()

    this.app
      .service('spells')
      .on('created', this.watchSpellCreatedHandler.bind(this))

    this.app
      .service('spells')
      .on('removed', this.watchSpellDeleteHandler.bind(this))
  }

  /**
   * Initializes the channels for the agent.  This is used to load the initial events for the agent.
   */
  async initializeChannels() {
    const agentChannels = await this.prisma.agent_channels.findMany({
      where: {
        agentId: this.agent.id,
        channelActive: true,
      },
    })
    const channelPromises = agentChannels?.map(async agentChannel => {
      this.logger.trace(`Loading spell casters for ${agentChannel.channelKey}`)
      const spellCasters = await this.loadSpellCastersByEventKey(
        agentChannel.channelKey,
        agentChannel.initialEvent as EventPayload
      )

      return spellCasters
    })
    await Promise.all(channelPromises)
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
    this.spells.set(spell.id, spell)
  }

  private watchSpellDeleteHandler(spell: SpellInterface) {
    if (!this.watchSpells) return
    if (spell.type !== 'behave') return
    if (this.hasSpellCaster(spell.id)) return
    if (this.agent.projectId !== spell.projectId) return

    if (this.hasSpellCaster(spell.id)) {
      this.clearSpellCasters(spell.id)
    }
  }

  /**
   * Updates the spell state for the given spell id.
   * @param {string} spellId - Id of the spell.
   * @param {Partial<SpellState>} update - Partial update to the spell state.
   * @example
   * spellbook.updateSpellState(spellId, { isRunning: true });
   */
  async updateSpellState(spellId: string, update: Partial<SpellState>) {
    // here we will use keyv
    const key = `agent:${this.agent.id}spell:${spellId}:state`
    const keyv = this.app.get('keyv')

    const currentState = (await keyv.get(key)) || {
      isRunning: true,
      debug: true,
    }

    await keyv.set(key, { ...currentState, ...update })
  }

  async getSpellState(spellId: string): Promise<SpellState> {
    const key = `agent:${this.agent.id}spell:${spellId}:state`
    const keyv = this.app.get('keyv')

    const currentState = await keyv.get(key)

    if (!currentState) {
      await this.updateSpellState(spellId, this.initialState)
      return this.initialState
    }

    return currentState
  }

  /**
   * Initializes the commands for the Spellbook.  These can be sent by the agentCommander
   * to control the spellbook.
   *
   */
  initializeCommands() {
    this.commandHub.registerDomain('agent', 'spellbook', {
      toggleLive: this.toggleLive.bind(this),
      toggleDebug: this.toggleDebug.bind(this),
      pauseSpell: this.pauseSpell.bind(this),
      playSpell: this.playSpell.bind(this),
      killSpell: this.killSpell.bind(this),
      killSpells: this.killSpells.bind(this),
      syncState: this.syncState.bind(this),
      refreshSpells: this.refreshSpells.bind(this),
      startEngineEvent: this.startEngineEvent.bind(this),
      stopEngineEvent: this.stopEngineEvent.bind(this),
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
    this.logger.trace(`Plugins loaded in Spellbook for agent ${this.agent.id}`)
    this.pluginManager.getPlugins().forEach(plugin => {
      this.setupPluginWorker(plugin)
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

  private eventKeyFromEvent(event: EventPayload) {
    return event.channel ? `${event.plugin}:${event.channel}` : 'default'
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
    const eventKey = this.eventKeyFromEvent(_payload)
    const payload = { ..._payload }

    const isChannelDisabled = await this.isChannelDisabled(eventKey)

    if (isChannelDisabled && !payload.isPlaytest) return

    // we need a way to determin if this is the initial time it is set, if so we want to set it then
    const spellCasters = await this.createOrGetSpellCasters(eventKey, payload)

    for (const [spellId, spellCaster] of spellCasters) {
      if (_payload.isPlaytest && spellId !== _payload?.spellId) continue

      this.logger.trace(`Handling event ${eventName} for ${spellId}`)
      spellCaster?.handleEvent(dependency, eventName, payload)
    }
  }

  async isChannelDisabled(eventKey: string) {
    const agentChannel = await this.prisma.agent_channels
      .findFirst({
        where: {
          agentId: this.agent.id,
          channelKey: eventKey,
        },
      })
      .catch(err => {
        console.error('Error fetching agent channel', err)
      })

    if (!agentChannel) {
      return false
    }

    return !agentChannel.channelActive
  }

  async createOrGetAgentChannel(eventKey: string, event: EventPayload) {
    // don't persist playtest channel events
    if (event.isPlaytest || event.skipPersist) return
    const agentId = this.agent.id
    const agentChannel = await this.prisma.agent_channels
      .findFirst({
        where: {
          agentId,
          channelKey: eventKey,
        },
      })
      .catch(err => {
        console.error('Error fetching agent channel', err)
      })

    if (!agentChannel) {
      const newAgentChannel = await this.prisma.agent_channels
        .create({
          data: {
            agentId,
            channelKey: eventKey,
            channelName: event.plugin || '',
            initialEvent: event,
            // initialState: await this.getSpellState(event.spellId || ''),
          },
        })
        .catch(err => {
          console.error('Error creating agent channel', err)
        })
      if (!newAgentChannel) {
        throw new Error('Error creating agent channel')
      }
    }
    return agentChannel
  }

  async getSpellcasterById(spellId: string, event: EventPayload) {
    const eventKey = this.eventKeyFromEvent(event)
    const spellCasters = await this.createOrGetSpellCasters(eventKey, event)
    if (!spellCasters) return null
    return spellCasters.get(spellId)
  }

  async createOrGetSpellCasters(eventKey: string, event: EventPayload) {
    const spellCasters = this.eventMap.get(eventKey)

    // create or get the agent channel if it doesnt exist
    await this.createOrGetAgentChannel(eventKey, event)
    if (!spellCasters) {
      return await this.loadSpellCastersByEventKey(eventKey, event)
      //load spell casters for event
    }
    return spellCasters
  }

  async loadSpellCastersByEventKey(
    eventKey: string,
    event: EventPayload,
    initialState?: SpellState
  ) {
    const spellPromises = Array.from(this.spells.values()).map(async spell => {
      const spellCaster = await this.loadSpell(spell, initialState)
      spellCaster?.loadInitialEvent(event)
      return spellCaster
    })
    const loadedSpells = await Promise.all(spellPromises)
    const validSpellCasters = loadedSpells.filter(
      (spellCaster): spellCaster is SpellCaster<A> => !!spellCaster
    )
    const spellMap = new Map(
      validSpellCasters.map(spellCaster => [spellCaster.spell.id, spellCaster])
    )
    this.eventMap.set(eventKey, spellMap)
    return spellMap
  }

  /**
   * Syncs the state of the spell with the server.
   * @param {any} data - Data payload.
   * @example
   * this.syncState(data);
   */
  async syncState() {
    for (const [spellId] of this.spells.keys()) {
      const spellState = await this.getSpellState(spellId)
      this.agent.pubsub.publish(AGENT_SPELL_STATE(this.agent.id), {
        spellId,
        state: spellState,
      })
    }
  }

  // todo: refresh spells doesnt need to laod spells right now.  We can just reset the state.
  async refreshSpells() {
    await this.clearAllSpellCasters()
    await this.resetAllSpellCasterStates()

    const spellsData = await this.app.service('spells').find({
      query: {
        projectId: this.agent.projectId,
        type: 'behave',
        spellReleaseId: this.agent.currentSpellReleaseId || 'null',
      },
    })
    await this.loadSpells(spellsData.data)
  }

  /**
   * Toggles the watchSpells flag.
   */
  toggleLive(data: { live: any }) {
    this.logger.trace(`Toggling watchSpells to ${data.live}`)
    const { live } = data
    this.watchSpells = live ? live : !this.watchSpells

    for (const spellCasters of this.eventMap.values()) {
      for (const spellCaster of spellCasters.values()) {
        if (live) {
          spellCaster.toggleLive(true)
        } else {
          spellCaster.toggleLive(false)
        }
      }
    }
  }

  /**
   * Toggles the debug flag.
   */
  async toggleDebug(data: { debug: any; spellId?: any }) {
    this.logger.trace(`Toggling debug to ${data.debug}`)
    const { spellId, debug } = data

    for (const spellCasters of this.eventMap.values()) {
      const spellCaster = spellCasters.get(spellId)
      if (spellCaster) {
        spellCaster.toggleDebug(debug)
      }
    }

    await this.updateSpellState(spellId, { debug })
  }

  /**
   * Loads the spell casters for the given spells.  We use this to load the spells when the agent starts.
   * With this new system, we no longer need a single root spell but all spells can process events in parallel.
   * @param {SpellInterface[]} spells - Array of spell instances.
   * @returns {Promise<void>} - Promise that resolves when the spells are loaded.
   * @example
   * await spellbook.loadSpells(spells);
   */
  loadSpells(spells: SpellInterface[]) {
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

    this.clearAllSpellCasters()
    this.spells.clear()

    for (const spell of spells) {
      this.spells.set(spell.id, spell)
    }
  }
  /**
   * Loads the spell runner for the given spell id.
   * @param {string} spellId - Id of the spell.
   * @returns {Promise<SpellCaster | undefined>} - Promise that resolves with the loaded spell runner instance or undefined if there was an error.
   * @example
   * const spellCaster= await spellbook.loadById(spellId);
   */
  async loadById(spellId: string): Promise<SpellCaster<A> | null> {
    this.logger.debug(`Loading spell ${spellId}`)
    try {
      const spell = await this.app.service('spells').get(spellId)

      this.logger.debug(`Reloading spell ${spellId}`)
      return await this.loadSpell(spell)
    } catch (error) {
      console.log('Error!', error)
      this.logger.error(
        error,
        `SPELLBOOK: Error loading spell ${spellId} by id`
      )
      return null
    }
  }

  async reloadSpells() {
    this.logger.debug(`Reloading spells for agent ${this.agent.id}`)
    const spellsData = await this.app.service('spells').find({
      query: {
        projectId: this.agent.projectId,
        type: 'behave',
        spellReleaseId: this.agent.currentSpellReleaseId || 'null',
      },
    })
    await this.loadSpells(spellsData.data)
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
    spell: SpellInterface,
    _initialState?: SpellState
  ): Promise<SpellCaster<A> | null> {
    if (!spell) {
      this.agent?.error('No spell provided')
      console.error('No spell provided')
      return null
    }

    this.spells.set(spell.id, spell)

    const initialState = _initialState ?? (await this.getSpellState(spell.id))

    try {
      const spellCaster = new SpellCaster({
        agent: this.agent,
        pluginManager: this.pluginManager,
        connection: this.app.get('redis'),
        initialState,
      })

      await spellCaster.initialize(spell)

      if (this.watchSpells) {
        spellCaster.toggleLive(true)
      }

      // we want to make sure we ALWAYS maintain a reference to the spellCaster
      // this.cachePool.set(spell.id, spellCaster)

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
    const newSpellCaster = await this.loadSpell(spell)

    if (!newSpellCaster) {
      this.agent.error(`Error updating spell ${spell.id}`)
      return
    }
    this.replaceSpellCaster(spell.id, newSpellCaster)
    // load the updated spell into memory
  }

  /**
   * Checks if the spell runner exists for the given spell id.
   * @param {string} spellId - Id of the spell.
   * @returns {boolean} - True if spell runner exists, false otherwise.
   * @example
   * const hasSpellRunner = spellbook.hasSpellRunner(spellId);
   */
  hasSpellCaster(spellId: string): boolean {
    for (const spellCasters of this.eventMap.values()) {
      if (spellCasters.has(spellId)) {
        return true
      }
    }
    return false
  }

  replaceSpellCaster(spellId: string, spellCaster: SpellCaster<A>) {
    for (const spellCasters of this.eventMap.values()) {
      if (spellCasters.has(spellId)) {
        const oldSpellCaster = spellCasters.get(spellId)
        if (oldSpellCaster) {
          oldSpellCaster.dispose()
        }
        spellCasters.set(spellId, spellCaster)
      }
    }
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
    for (const [eventKey, spellCasters] of this.eventMap) {
      const spellCaster = spellCasters.get(spellId)
      if (spellCaster) {
        spellCaster.dispose()
        spellCaster.resetState()
        spellCasters.delete(spellId)
      }
      if (spellCasters.size === 0) {
        this.eventMap.delete(eventKey)
      }
    }
  }

  clearAllSpellCasters() {
    for (const spellCasters of this.eventMap.values()) {
      for (const spellCaster of spellCasters.values()) {
        spellCaster.dispose()
        spellCaster.resetState()
      }
    }
    this.eventMap.clear()
  }

  /**
   * Resets the spell runner states for the given spell id.
   * This will go into the state service and wipe all keys from memory.
   * @param {string} spellId - Id of the spell.
   */
  resetSpellCasterStates(spellId: string) {
    for (const spellCasters of this.eventMap.values()) {
      const spellCaster = spellCasters.get(spellId)
      if (spellCaster) {
        spellCaster.resetState()
      }
    }
  }

  /*
   * Resets all spell runner states.
   * This will go into the state service and wipe all keys from memory.
   */
  resetAllSpellCasterStates() {
    for (const spellCasters of this.eventMap.values()) {
      for (const spellCaster of spellCasters.values()) {
        spellCaster.resetState()
      }
    }
  }

  /**
   * Starts the spell runner for the given spell id.
   * Used by the agent to control the spell runner via commands.
   * @param {string} spellId - Id of the spell.
   */
  async playSpell(data: { spellId: any }) {
    const { spellId } = data
    for (const spellCasters of this.eventMap.values()) {
      const spellCaster = spellCasters.get(spellId)
      if (spellCaster) {
        spellCaster.startRunLoop()
      }
    }
    await this.updateSpellState(spellId, { isRunning: true })
  }

  /**
   * Stops the spell runner for the given spell id.
   * Used by the agent to control the spell runner via commands.
   * @param {string} spellId - Id of the spell.
   */
  async pauseSpell(data: { spellId: any }) {
    const { spellId } = data
    for (const spellCasters of this.eventMap.values()) {
      const spellCaster = spellCasters.get(spellId)
      if (spellCaster) {
        spellCaster.stopRunLoop()
      }
    }
    await this.updateSpellState(spellId, { isRunning: false })
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
    // this.resetAllSpellCasterStates()
  }

  /**
   * Kills the spell runner for the given spell id.
   * Used by the agent to control the spell runner via commands.
   * @param {string} spellId - Id of the spell.
   * @example
   * spellbook.killSpell(spellId);
   */
  killSpell(data: { spellId: any }) {
    const { spellId } = data
    this.agent.log(`Killing spell ${spellId} in agent ${this.agent.id}`)
    this.clearSpellCasters(spellId)
    this.resetSpellCasterStates(spellId)
  }

  /**
   * Toggles the run all flag for the spellbook.
   * Used by the agent to control the spell runner via commands.
   * @param {any} data - Data payload.
   * @example
   * spellbook.startEngineEvent(data);
   */

  async startEngineEvent(eventPayload: EventPayload) {
    const { agentId, isPlaytest } = eventPayload
    if (agentId !== this.agent.id) return
    const eventKey = this.eventKeyFromEvent(eventPayload)
    if (!isPlaytest) return

    await this.reloadSpells()
    await this.createOrGetSpellCasters(eventKey, eventPayload)

    this.playAllSpells()
  }

  async stopEngineEvent(eventPayload: EventPayload) {
    const { agentId, isPlaytest } = eventPayload
    if (agentId !== this.agent.id) return
    const eventKey = this.eventKeyFromEvent(eventPayload)
    if (!isPlaytest) return
    this.clearEventSpellCasters(eventKey)
  }

  async playAllSpells() {
    console.log('PLAYING SPELL')
    for (const spellCasters of this.eventMap.values()) {
      for (const spellCaster of spellCasters.values()) {
        this.playSpell({ spellId: spellCaster.spell.id })
        await this.updateSpellState(spellCaster.spell.id, { isRunning: true })
      }
    }
  }

  async clearEventSpellCasters(eventKey: string) {
    const spellCasters = this.eventMap.get(eventKey)
    if (!spellCasters) return
    for (const spellCaster of spellCasters.values()) {
      spellCaster.dispose()
    }

    this.eventMap.delete(eventKey)
  }

  /**
   * Cleans up the SpellManager instance.
   */
  onDestroy() {
    this.clear()
    this.resetAllSpellCasterStates()
    this.clearAllSpellCasters()

    this.app
      .service('spells')
      .removeListener('updated', this.watchSpellUpdateHandler)

    this.app
      .service('spells')
      .removeListener('patched', this.watchSpellUpdateHandler)

    this.app
      .service('spells')
      .removeListener('created', this.watchSpellCreatedHandler)

    this.app
      .service('spells')
      .removeListener('removed', this.watchSpellDeleteHandler)
  }

  /**
   * Clears the spell runner map.
   */
  clear() {
    this.eventMap.clear()
    this.pluginManager.centralEventBus.removeAllListeners()
  }
}
