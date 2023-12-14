import { Application } from 'server/core'
import io from 'socket.io'
import { getLogger } from 'shared/core'

import { isEqual } from 'radash'
import { MagickSpellInput, SpellInterface } from '../types'
import SpellRunner from './SpellRunner'

type SpellManagerArgs = {
  socket?: io.Socket
  cache?: boolean
  app: Application
  watchSpells?: boolean
  agent?: any
}

type RunArgs = {
  spellId: string
  inputs: MagickSpellInput
  secrets: Record<string, string>
  publicVariables: Record<string, unknown>
  app: Application
}

/**
 * SpellManager class manages the spells and their runners.
 */
export default class SpellManager {
  /**
   * Map of spell runners for each spell id.
   */
  spellRunnerMap: Map<string, SpellRunner[]> = new Map()

  /**
   * Socket instance for communication.
   */
  socket?: io.Socket

  /**
   * Flag to enable/disable caching.
   */
  cache: boolean

  /**
   * Application instance.
   */
  app: Application

  /**
   * Agent instance.
   */
  agent?: any

  /**
   * Flag to enable/disable watching spells.
   */
  watchSpells = false

  /**
   * Logger instance.
   */
  logger = getLogger()

  /**
   * Creates an instance of SpellManager.
   * @param {SpellManagerArgs} args - Arguments for SpellManager.
   */
  constructor({
    socket = undefined,
    cache = false,
    agent = undefined,
    app,
    watchSpells = false,
  }: SpellManagerArgs) {
    this.socket = socket
    this.app = app
    this.cache = cache
    this.agent = agent
    this.watchSpells = watchSpells

    // this will keep the spells in sync with the server
    this.app.service('spells').on('updated', this.watchSpellHandler.bind(this))
  }

  watchSpellHandler(spell: SpellInterface) {
    if (!this.watchSpells) return
    if (this.hasSpellRunner(spell.id)) {
      this.logger.debug(`Updating spell ${spell.id} in agent ${this.agent.id}`)
      this.updateSpell(spell)
    }
  }

  /**
   * Cleans up the SpellManager instance.
   */
  onDestroy() {
    this.clear()

    if (this.socket) {
      this.socket.disconnect()
    }
    //
    this.app.service('spells').removeListener('updated', this.watchSpellHandler)
  }

  /**
   * Returns a ready spell runner for the given spell id.
   * @param {string} spellId - Id of the spell.
   * @returns {SpellRunner | undefined} - Ready spell runner instance.
   */
  getReadySpellRunner(spellId: string): SpellRunner | undefined {
    return this.spellRunnerMap.get(spellId)?.find(runner => !runner.isBusy())
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
   * Checks if the spell runner exists for the given spell id.
   * @param {string} spellId - Id of the spell.
   * @returns {boolean} - True if spell runner exists, false otherwise.
   */
  hasSpellRunner(spellId: string): boolean {
    return this.spellRunnerMap.has(spellId)
  }

  /**
   * Clears the spell runner map.
   */
  clear() {
    this.spellRunnerMap = new Map()
  }

  /**
   * Loads the spell runner for the given spell id.
   * @param {string} spellId - Id of the spell.
   * @returns {Promise<SpellRunner | undefined>} - Promise that resolves with the loaded spell runner instance or undefined if there was an error.
   */
  async loadById(spellId: string): Promise<SpellRunner | undefined> {
    this.logger.debug(`Loading spell ${spellId}`)
    try {
      const spellService = this.app.service('spells')
      const query: { spellReleaseId?: string } = {}
      const spell = await spellService.get(spellId, { query })

      if (!spell) {
        this.logger.error(
          { spellId },
          `Error loading spell %s with version %s: %s`,
          spellId
        )
      }

      if (
        this.hasSpellRunner(spellId) &&
        this.getReadySpellRunner(spellId) &&
        isEqual(
          this.getReadySpellRunner(spellId)!.currentSpell.graph,
          spell.graph
        )
      ) {
        return this.getReadySpellRunner(spellId)
      }

      this.logger.debug({ spellId }, `Reloading spell %s`, spellId)
      return this.load(spell)
    } catch (error) {
      this.logger.error(
        { spellId },
        `Error loading spell %s: %o`,
        spellId,
        error
      )
      return
    }
  }

  /**
   * Loads the spell runner for the given spell.
   * @param {SpellInterface} spell - Spell instance.
   * @returns {Promise<SpellRunner | null>} - Promise that resolves with the loaded spell runner instance or undefined if there was an error.
   */
  async load(spell: SpellInterface): Promise<SpellRunner | undefined> {
    if (!spell) {
      this.agent?.error('No spell provided')
      console.error('No spell provided')
      return
    }

    const spellRunner = new SpellRunner({
      app: this.app,
      socket: this.socket,
      agent: this.agent,
      spellManager: this,
    })

    await spellRunner.loadSpell(spell)

    const spellRunnerList = this.spellRunnerMap.get(spell.id)
    if (spellRunnerList) {
      spellRunnerList.push(spellRunner)
    } else {
      this.spellRunnerMap.set(spell.id, [spellRunner])
    }

    return spellRunner
  }

  /**
   * Updates the spell runner for the given spell.
   * @param {SpellInterface} spell - Spell instance.
   * @returns {Promise<void>} - Promise that resolves when the spell runner is updated.
   */
  async updateSpell(spell: SpellInterface): Promise<void> {
    const spellRunner = this.getReadySpellRunner(spell.id)

    if (!spellRunner) {
      this.logger.warn(`No spell runner found for spell ${spell.id}`)
      await this.load(spell)
      return
    }

    // we need to go through every spellRunner and update it
    // todo monitor this for performance.  Might be easier to nuke the spellRunners and create a new one
    const spellRunnerList = this.spellRunnerMap.get(spell.id)
    if (spellRunnerList) {
      spellRunnerList.forEach(async runner => {
        await runner.loadSpell(spell)
      })
    }
  }

  /**
   * Runs the spell with the given arguments.
   * @param {RunArgs} runArgs - Arguments for running the spell.
   * @returns {Promise<Record<string, unknown>>} - Promise that resolves with the result of running the spell.
   */
  async run(runArgs: RunArgs): Promise<Record<string, unknown>> {
    this.logger.error(
      `You should use the agent commander to run spells instead of the spellManager run function`
    )

    const { spellId, inputs, secrets, publicVariables, app } = runArgs
    let result: Record<string, unknown> | null = null
    if (this.agent) {
      await app.get('agentCommander').runSpellWithResponse({
        inputs,
        secrets,
        publicVariables,
        agentId: this.agent.id,
        spellId: this.agent.rootSpellId as string,
      })

      this.agent?.publishEvent(`${spellId}:run`, {
        inputs,
        publicVariables,
        result,
      })
    } else {
      let runner = this.getReadySpellRunner(spellId)

      if (!runner) {
        this.logger.warn('Running without an agent is deprecated.')
        this.logger.warn(
          `No spell runner found for spell ${spellId}.  Loading a new one.`
        )
        runner = await this.loadById(spellId)
      }

      result = (await runner?.runComponent(runArgs)) ?? null
    }

    return result || {}
  }
}
