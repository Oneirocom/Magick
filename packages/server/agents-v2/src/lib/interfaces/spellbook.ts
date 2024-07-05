import { EventPayload } from './IEvent'
import { ISpell } from './spell'
import { ISpellCaster } from './spellcaster'

export interface ISpellbook {
  getSpells(): Map<string, ISpell>
  loadSpell(spellId: string, spell: any, channel: string): void
  unloadSpell(spellId: string): void
  getSpellCaster(spellId: string): ISpellCaster | undefined
  handleEvent(sourceName: string, event: EventPayload): void
}
