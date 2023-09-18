// import { Application } from '@magickml/server-core';
import { Application } from '@feathersjs/koa'
import io from 'socket.io'
import { getLogger } from '@magickml/core'

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

export default class SpellManager {
  spellRunnerMap: Map<string, SpellRunner[]> = new Map()
  socket?: io.Socket
  cache: boolean
  app: Application
  agent?: any
  logger = getLogger()

  constructor({
    socket = undefined,
    cache = false,
    agent = undefined,
    app,
    // ensures that the spells are kept in sync with the server
    watchSpells = false,
  }: SpellManagerArgs) {
    this.socket = socket
    this.app = app
    this.cache = cache
    this.agent = agent

    // this will keep the spells in sync with the server
    this.app.service('spells').on('updated', (spell: SpellInterface) => {
      if (!watchSpells) return
      if (this.hasSpellRunner(spell.id)) {
        this.updateSpell(spell)
      }
    })
  }

  getReadySpellRunner(spellId: string) {
    return this.spellRunnerMap.get(spellId)?.find(runner => !runner.isBusy())
  }

  hasSpellRunner(spellId: string) {
    return this.spellRunnerMap.has(spellId)
  }

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
      const spell = await this.app.service('spells').get(spellId)

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

      this.logger.debug(`Reloading spell ${spellId}`)
      return this.load(spell)
    } catch (error) {
      this.logger.error(`Error loading spell ${spellId}: %o`, error)
      return
    }
  }

  async load(spell: SpellInterface) {
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

  async updateSpell(spell: SpellInterface) {
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

  async run(runArgs: RunArgs) {
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
        app,
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
