import { TypedEmitter } from 'tiny-typed-emitter'
import { Agent } from '../../Agent'
import { ISpellbook } from '../../interfaces/spellbook'
import { ISpell } from '../../interfaces/spell'
import { SpellCaster } from './spellcaster'
import { EventPayload } from '../../interfaces/IEvent'
import { ISpellCaster } from '../../interfaces/spellcaster'

export class Spellbook implements ISpellbook {
  private spellCasters: Map<string, ISpellCaster> = new Map()
  private channelToSpellMap: Map<string, Set<string>> = new Map()

  constructor(private agent: Agent) {}

  handleEvent(sourceName: string, event: EventPayload): void {
    this.routeEvent(event)
  }

  getSpells(): Map<string, ISpell> {
    const spells = new Map<string, ISpell>()
    this.spellCasters.forEach((spellCaster, spellId) => {
      spells.set(spellId, spellCaster.spell)
    })
    return spells
  }

  routeEvent(event: EventPayload): void {
    const channel = this.getChannelFromEvent(event)
    if (channel) {
      const spellIds = this.channelToSpellMap.get(channel)
      if (spellIds) {
        spellIds.forEach(spellId => {
          const spellCaster = this.spellCasters.get(spellId)
          if (spellCaster) {
            spellCaster.handleEvent(event)
          }
        })
      }
      this.agent.emit('eventRouted', channel, event)
    }
  }

  private getChannelFromEvent(event: EventPayload): string | undefined {
    return event.channel
  }

  loadSpell(spellId: string, spell: any, channel: string): void {
    const spellCaster = new SpellCaster(spellId, spell, this.agent)
    this.spellCasters.set(spellId, spellCaster)

    if (!this.channelToSpellMap.has(channel)) {
      this.channelToSpellMap.set(channel, new Set())
    }
    this.channelToSpellMap.get(channel)!.add(spellId)

    this.agent.emit('spellLoaded', spellId, channel)
  }

  unloadSpell(spellId: string): void {
    const spellCaster = this.spellCasters.get(spellId)
    if (spellCaster) {
      spellCaster.dispose()
      this.spellCasters.delete(spellId)

      for (const [channel, spells] of this.channelToSpellMap.entries()) {
        if (spells.delete(spellId) && spells.size === 0) {
          this.channelToSpellMap.delete(channel)
        }
      }

      this.emit('spellUnloaded', spellId)
    }
  }

  getSpellCaster(spellId: string): SpellCaster | undefined {
    return this.spellCasters.get(spellId)
  }
}
