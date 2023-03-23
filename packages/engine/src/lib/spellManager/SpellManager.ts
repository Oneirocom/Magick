import io from 'socket.io'

import { EngineContext, MagickSpellInput, Spell } from '../types'
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const runSpell: EngineContext['runSpell'] = async ({
      inputs: flattenedInputs,
      spellId,
      secrets,
      publicVariables,
    }
    ): Promise<Record<string, unknown>> => {
      if (this.getSpellRunner(spellId)) {
        const outputs = await this.run(spellId, flattenedInputs, secrets, publicVariables)
        return outputs as Record<string, unknown>
      }

      const spell = await magickInterface.getSpell(spellId)

      if (!spell) {
        console.error(`No spell found with name ${spellId}`)
        return {}
      }

      await this.load(spell)

      const outputs = await this.run(spellId, flattenedInputs, secrets, publicVariables)

      return outputs as Record<string, unknown>
    }

    return {
      ...magickInterface,
      runSpell,
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

  async load(spell: Spell, overload = false) {
    if (!spell) {
      console.error('No spell provided')
      return
    }
    if (this.spellRunnerMap.has(spell.id) && !overload){
      return this.getSpellRunner(spell.id)
    }

    const spellRunner = new SpellRunner({
      magickInterface: this.magickInterface,
      socket: this.socket,
    })

    await spellRunner.loadSpell(spell)

    this.spellRunnerMap.set(spell.id, spellRunner)

    return spellRunner
  }

  async run(spellId: string, inputs: MagickSpellInput, secrets: Record<string, string>, publicVariables) {
    const runner = this.getSpellRunner(spellId)
    
    const result = await runner?.runComponent({
      inputs,
      secrets,
      publicVariables,
    })

    return result || {}
  }
}
