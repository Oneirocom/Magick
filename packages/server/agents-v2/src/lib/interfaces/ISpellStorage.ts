import { ISpell } from './spell'

declare module '../Agent' {
  interface BaseAgentEvents {
    'spells:loaded': (spells: ISpell[]) => Promise<void> | void
    'spell:created': (spell: ISpell) => Promise<void> | void
    'spell:updated': (spell: ISpell) => Promise<void> | void
    'spell:deleted': (id: string) => Promise<void> | void
  }
}

export interface ISpellStorage {
  loadSpells(): Promise<ISpell[]>
  getSpell(id: string): Promise<ISpell | null>
  saveSpell(spell: ISpell): Promise<ISpell>
  deleteSpell(id: string): Promise<void>
}
