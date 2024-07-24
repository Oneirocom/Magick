import { ChannelInterface } from './IChannelManager'
import { ISpellbook } from './ISpellbook'
import { ISpell } from './spell'

export interface ISpellbookLibrary {
  addSpellbook(channel: ChannelInterface): Promise<ISpellbook>
  removeSpellbook(channelId: string): Promise<void>
  getSpellbook(channelId: string): ISpellbook | undefined
  catalogNewSpell(spell: ISpell): Promise<void>
  updateSpellInAllBooks(spell: ISpell): Promise<void>
  removeSpellFromAllBooks(spellId: string): Promise<void>
}
