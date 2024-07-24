import { EventPayload } from '@magickml/shared-services'
import { ISpell } from './spell'
import { ChannelInterface } from './IChannelManager'
import { ISpellCaster } from './ISpellcaster'

export interface ISpellbook {
  initialize(): Promise<void>
  setChannel(channel: ChannelInterface): Promise<void>
  dispose(): Promise<void>
  handleEvent(eventName: string, data: EventPayload): Promise<void>
  addSpell(spell: ISpell): Promise<void>
  updateSpell(spell: ISpell): Promise<void>
  removeSpell(spellId: string): Promise<void>
  getSpellCasters(): ISpellCaster[]
}
