import { ISpell } from './spell'

export interface ISpellManager {
  getSpell(id: string): Promise<ISpell | null>
  getSpellsForChannel(channelId: string): Promise<ISpell[]>
  createSpell(spell: Omit<ISpell, 'id'>): Promise<ISpell>
  updateSpell(id: string, updates: Partial<ISpell>): Promise<ISpell>
  deleteSpell(id: string): Promise<void>
}
