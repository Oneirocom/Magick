import { inject, injectable, interfaces } from 'inversify'
import { ChannelInterface } from '../interfaces/IChannelManager'
import { ISpellbook } from '../interfaces/ISpellbook'
import { TYPES } from './dependency.config'
import { ISpellManager } from '../interfaces/ISpellManager'
import { EventPayload } from '../interfaces/IEvent'
import { ISpell } from '../interfaces/spell'
import { ISpellCaster } from '../interfaces/ISpellcaster'

@injectable()
export class Spellbook implements ISpellbook {
  private spellCasters: Map<string, ISpellCaster> = new Map()
  private channel!: ChannelInterface

  constructor(
    @inject(TYPES['Factory<SpellCaster>'])
    private spellCasterFactory: interfaces.Factory<ISpellCaster>,
    @inject(TYPES.SpellManager) private spellManager: ISpellManager
  ) {}

  async initialize(): Promise<void> {
    const spells = await this.spellManager.getSpellsForChannel(this.channel.id)
    await Promise.all(spells.map(spell => this.addSpell(spell)))
  }

  async setChannel(channel: ChannelInterface): Promise<void> {
    this.channel = channel
  }

  async dispose(): Promise<void> {
    await Promise.all(
      Array.from(this.spellCasters.values()).map(caster => caster.dispose())
    )
    this.spellCasters.clear()
  }

  async handleEvent(eventName: string, data: EventPayload): Promise<void> {
    await Promise.all(
      Array.from(this.spellCasters.values()).map(caster =>
        caster.handleEvent(eventName, data)
      )
    )
  }

  async addSpell(spell: ISpell): Promise<void> {
    if (this.spellCasters.has(spell.id)) {
      console.warn(
        `Spell ${spell.id} already exists in this spellbook. Updating instead.`
      )
      return this.updateSpell(spell)
    }

    const spellCaster = this.spellCasterFactory(this.channel) as ISpellCaster
    // await spellCaster.initialize()
    this.spellCasters.set(spell.id, spellCaster)
  }

  async updateSpell(spell: ISpell): Promise<void> {
    const existingCaster = this.spellCasters.get(spell.id)
    if (!existingCaster) {
      console.warn(
        `Spell ${spell.id} not found in this spellbook. Adding as new.`
      )
      return this.addSpell(spell)
    }

    // we need to replace this spellcaster with a new one
    await existingCaster.dispose()
    this.spellCasters.delete(spell.id)
    const newCaster = this.spellCasterFactory(this.channel) as ISpellCaster
    // await newCaster.initialize()
    this.spellCasters.set(spell.id, newCaster)
  }

  async removeSpell(spellId: string): Promise<void> {
    const spellCaster = this.spellCasters.get(spellId)
    if (spellCaster) {
      await spellCaster.dispose()
      this.spellCasters.delete(spellId)
    }
  }

  getSpellCasters(): ISpellCaster[] {
    return Array.from(this.spellCasters.values())
  }
}
