import io from 'socket.io'

import { EngineContext, Spell } from '../../types'
import SpellRunner from './SpellRunner'

export default class SpellManager {
  spellRunnerMap: Map<string, SpellRunner> = new Map()
  socket?: io.Socket
  magickInterface: EngineContext

  constructor(magickInterface: EngineContext, socket?: io.Socket) {
    this.socket = socket
    this.magickInterface = magickInterface
  }

  getSpellRunner(spellId: string) {
    return this.spellRunnerMap.get(spellId)
  }

  load(spell: Spell, overload = false) {
    if (this.spellRunnerMap.has(spell.name) && !overload)
      return this.getSpellRunner(spell.name)

    const spellRunner = new SpellRunner({
      magickInterface: this.magickInterface,
      socket: this.socket,
    })

    spellRunner.loadSpell(spell)

    this.spellRunnerMap.set(spell.name, spellRunner)

    return spellRunner
  }

  async run(spellId: string, inputs: Record<string, any>) {
    const runner = this.getSpellRunner(spellId)
    const result = await runner?.defaultRun(inputs)

    return result
  }
}
