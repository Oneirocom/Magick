import io from 'socket.io'

import { EngineContext, Spell } from '../types'
import SpellRunner from './SpellRunner'

type SpellManagerArgs = {
  magickInterface: EngineContext
  socket?: io.Socket
  cache?: boolean
}

export default class SpellManager {
  spellRunnerMap: Map<string, SpellRunner> = new Map()
  socket?: io.Socket
  cache: boolean
  magickInterface: EngineContext

  constructor({
    magickInterface,
    socket = undefined,
    cache = false,
  }: SpellManagerArgs) {
    this.socket = socket
    this.magickInterface = magickInterface

    this.cache = cache
  }

  // This getter will overwrite the standard runSpell with a new one.
  // this runSpell will add spells to the cache
  processMagickInterface(magickInterface): EngineContext {
    if (!this.cache) return magickInterface

    const runSpell: EngineContext['runSpell'] = async ({
      inputs,
      spellName,
      projectId
    }
    ) => {
      if (this.getSpellRunner(spellName)) {
        const outputs = await this.run(spellName, inputs)
        return outputs
      }

      const spell = await magickInterface.getSpell({spellName, projectId})

      if (!spell) {
        throw new Error(`No spell found with name ${spellName}`)
      }

      await this.load(spell)

      const outputs = await this.run(spellName, inputs)

      return outputs
    }

    return {
      ...magickInterface,
      runSpell,
    }
  }

  getSpellRunner(spellName: string) {
    return this.spellRunnerMap.get(spellName)
  }

  hasSpellRunner(spellName: string) {
    return this.spellRunnerMap.has(spellName)
  }

  clear() {
    this.spellRunnerMap = new Map()
  }

  async load(spell: Spell, overload = false) {
    if (!spell) throw new Error('No spell provided to load')
    if (this.spellRunnerMap.has(spell.name) && !overload)
      return this.getSpellRunner(spell.name)

    const spellRunner = new SpellRunner({
      magickInterface: this.magickInterface,
      socket: this.socket,
    })

    await spellRunner.loadSpell(spell)

    this.spellRunnerMap.set(spell.name, spellRunner)

    return spellRunner
  }

  async run(spellName: string, inputs: Record<string, any>) {
    const runner = this.getSpellRunner(spellName)
    const result = await runner?.defaultRun(inputs)

    return result
  }
}
