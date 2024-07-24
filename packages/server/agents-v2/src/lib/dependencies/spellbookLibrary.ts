import { injectable, inject, interfaces } from 'inversify'
import { Agent } from '../Agent'
import { ISpellbook } from '../interfaces/ISpellbook'
import { ISpellbookLibrary } from '../interfaces/ISpellbookLibrary'
import { ChannelInterface } from '../interfaces/IChannelManager'
import { ISpell } from '../interfaces/spell'
import { TYPES } from './dependency.config'

@injectable()
export class SpellbookLibrary implements ISpellbookLibrary {
  private spellbooks: Map<string, ISpellbook> = new Map()

  constructor(
    @inject(TYPES['Factory<Spellbook>'])
    private spellbookFactory: interfaces.Factory<ISpellbook>,
    @inject(TYPES.Agent) private agent: Agent
  ) {
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    this.agent.on('spell:created', this.catalogNewSpell.bind(this))
    this.agent.on('spell:updated', this.updateSpellInAllBooks.bind(this))
    this.agent.on('spell:deleted', this.removeSpellFromAllBooks.bind(this))
  }

  async addSpellbook(channel: ChannelInterface): Promise<ISpellbook> {
    const spellbook = this.spellbookFactory() as ISpellbook
    // await spellbook.initialize();
    this.spellbooks.set(channel.id, spellbook)
    return spellbook
  }

  async removeSpellbook(channelId: string): Promise<void> {
    const spellbook = this.spellbooks.get(channelId)
    if (spellbook) {
      await spellbook.dispose()
      this.spellbooks.delete(channelId)
    }
  }

  getSpellbook(channelId: string): ISpellbook | undefined {
    return this.spellbooks.get(channelId)
  }

  async catalogNewSpell(spell: ISpell): Promise<void> {
    for (const spellbook of this.spellbooks.values()) {
      await spellbook.addSpell(spell)
    }
  }

  async updateSpellInAllBooks(spell: ISpell): Promise<void> {
    for (const spellbook of this.spellbooks.values()) {
      await spellbook.updateSpell(spell)
    }
  }

  async removeSpellFromAllBooks(spellId: string): Promise<void> {
    for (const spellbook of this.spellbooks.values()) {
      await spellbook.removeSpell(spellId)
    }
  }
}
