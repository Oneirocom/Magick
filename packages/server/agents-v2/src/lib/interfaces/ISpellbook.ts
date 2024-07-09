import { ISpellCaster } from './ISpellCaster'
import { ISpell } from './spell'

export interface ISpellbook {
  initialize(): Promise<void>
  addSpell(spell: ISpell): Promise<void>
  removeSpell(spellId: string): Promise<void>
  handleEvent(eventName: string, data: any): void
  getSpellCasters(): ISpellCaster[]
}
