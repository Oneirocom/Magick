// import { Application } from '@magickml/server-core';
import { Application } from '@feathersjs/koa'
import io from 'socket.io'
import { Agent } from '@magickml/agents'

import { MagickSpellInput, SpellInterface } from '../types'
import SpellRunner from './SpellRunner'

type SpellManagerArgs = {
  socket?: io.Socket
  cache?: boolean
  app: Application
  watchSpells?: boolean
  agent?: Agent
}

type RunArgs = {
  spellId: string
  inputs: MagickSpellInput
  secrets: Record<string, string>
  publicVariables
  app: Application
}

export default class SpellManager {
  spellRunnerMap: Map<string, SpellRunner> = new Map()
  socket?: io.Socket
  cache: boolean
  app: Application
  agent?: Agent

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
          this.load(spell, true)
        }
      })
    }
  }

  getSpellRunner(spellId: string) {
    // we want to track which spells are currently busy here.
    return this.spellRunnerMap.get(spellId)
  }

  hasSpellRunner(spellId: string) {
    return this.spellRunnerMap.has(spellId)
  }

  clear() {
    this.spellRunnerMap = new Map()
  }

  async loadById(spellId: string) {
    try {
      const spell = await this.app.service('spells').get(spellId)

      return this.load(spell)
    } catch (error) {
      console.error(`Error loading spell ${spellId}`, error)
      return null
    }
  }

  async load(spell: SpellInterface, overload = false) {
    if (!spell) {
      this.agent?.error('No spell provided')
      console.error('No spell provided')
      return
    }
    if (this.spellRunnerMap.has(spell.id) && !overload) {
      return this.getSpellRunner(spell.id)
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

    const result = await runner?.runComponent({
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
