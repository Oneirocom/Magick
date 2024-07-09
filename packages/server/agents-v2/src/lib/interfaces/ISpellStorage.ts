import { ISpell } from './spell'

export interface ISpellStorage {
  loadSpells(): Promise<ISpell[]>
  getSpell(id: string): Promise<ISpell | null>
  saveSpell(spell: ISpell): Promise<ISpell>
  deleteSpell(id: string): Promise<void>
}
