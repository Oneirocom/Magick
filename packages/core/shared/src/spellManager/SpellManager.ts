import io from 'socket.io'

import { EngineContext, MagickSpellInput, SpellInterface } from '../types'
import SpellRunner from './SpellRunner'

type SpellManagerArgs = {
  socket?: io.Socket
  cache?: boolean
}

export default class SpellManager {
  spellRunnerMap: Map<string, SpellRunner> = new Map()
  socket?: io.Socket
  cache: boolean

  constructor({
    socket = undefined,
    cache = false,
  }: SpellManagerArgs) {
    this.socket = socket

    this.cache = cache
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

  async load(spell: SpellInterface, overload = false) {
    if (!spell) {
      console.error('No spell provided')
      return
    }
    if (this.spellRunnerMap.has(spell.id) && !overload){
      return this.getSpellRunner(spell.id)
    }

    const spellRunner = new SpellRunner(this.socket)

    await spellRunner.loadSpell(spell)

    this.spellRunnerMap.set(spell.id, spellRunner)

    return spellRunner
  }

  async run(spellId: string, inputs: MagickSpellInput, secrets: Record<string, string>, publicVariables, app) {
    const runner = this.getSpellRunner(spellId)
    
    const result = await runner?.runComponent({
      inputs,
      secrets,
      publicVariables,
      app
    })

    return result || {}
  }
}
