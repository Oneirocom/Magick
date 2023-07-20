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
  spellRunnerMap: Map<string, SpellRunner> = new Map()
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
    if (watchSpells) {
      this.app.service('spells').on('updated', (spell: SpellInterface) => {
        if (this.hasSpellRunner(spell.id)) {
          this.load(spell)
        }
      })
    }
  }

  getSpellRunner(spellId: string) {
    return this.spellRunnerMap.get(spellId)
  }

  hasSpellRunner(spellId: string) {
    return this.spellRunnerMap.has(spellId)
  }

  clear() {
    this.spellRunnerMap = new Map()
  }

  async loadById(spellId: string) {
    this.logger.debug(`Loading spell ${spellId}`)
    try {
      const spell = await this.app.service('spells').get(spellId)

      if (
        this.hasSpellRunner(spellId)
        && isEqual(this.getSpellRunner(spellId)!.currentSpell.graph, spell.graph)
      ) {
        return this.getSpellRunner(spellId)
      }

      this.logger.debug(`Reloading spell ${spellId}`)
      return this.load(spell)
    } catch (error) {
      this.logger.error(`Error loading spell ${spellId}`, error)
      return null
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

    // maybe we make a map of maps here to keep track of the multiple instances of spells?
    this.spellRunnerMap.set(spell.id, spellRunner)

    return spellRunner
  }

  async run({ spellId, inputs, secrets, publicVariables, app }: RunArgs) {
    const runner = this.getSpellRunner(spellId)

    const result = await app.get('agentCommander').runSpellWithResponse({
      inputs,
      secrets,
      publicVariables,
      app,
      agent: this.agent,
    })

    this.agent?.publishEvent(`${spellId}:run`, {
      inputs,
      publicVariables,
      result,
    })

    return result || {}
  }
}
