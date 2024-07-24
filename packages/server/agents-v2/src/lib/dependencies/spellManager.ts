import { inject, injectable } from 'inversify'
import { Agent } from '../Agent'
import { ISpellStorage } from '../interfaces/ISpellStorage'
import { ISpell } from '../interfaces/spell'
import { TYPES } from './dependency.config'

@injectable()
export class SpellManager implements SpellManager {
  private spells: Map<string, ISpell> = new Map()

  constructor(
    @inject(TYPES.SpellStorage) private storage: ISpellStorage,
    @inject(TYPES.Agent) private agent: Agent
  ) {}

  async initialize(): Promise<void> {
    const spells = await this.storage.loadSpells()
    this.handleSpellsLoaded(spells)
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    this.agent.on('spell:created', this.handleSpellCreated.bind(this))
    this.agent.on('spell:updated', this.handleSpellUpdated.bind(this))
    this.agent.on('spell:deleted', this.handleSpellDeleted.bind(this))
  }

  private handleSpellCreated(spell: ISpell): void {
    this.spells.set(spell.id, spell)
  }

  private handleSpellUpdated(spell: ISpell): void {
    this.spells.set(spell.id, spell)
  }

  private handleSpellDeleted(id: string): void {
    this.spells.delete(id)
  }

  private handleSpellsLoaded(spells: ISpell[]): void {
    this.spells.clear()
    spells.forEach(spell => this.spells.set(spell.id, spell))
  }

  async getSpell(id: string): Promise<ISpell | null> {
    return this.spells.get(id) || null
  }

  getSpells(): ISpell[] {
    return Array.from(this.spells.values())
  }

  async createSpell(spellData: Omit<ISpell, 'id'>): Promise<ISpell> {
    const newSpell = await this.storage.saveSpell(spellData as ISpell)
    this.agent.emit('spell:created', newSpell)
    return newSpell
  }

  async updateSpell(id: string, updates: Partial<ISpell>): Promise<ISpell> {
    const existingSpell = await this.getSpell(id)
    if (!existingSpell) {
      throw new Error(`Spell with id ${id} not found`)
    }
    const updatedSpell = { ...existingSpell, ...updates }
    await this.storage.saveSpell(updatedSpell)
    this.agent.emit('spell:updated', updatedSpell)
    return updatedSpell
  }

  async deleteSpell(id: string): Promise<void> {
    await this.storage.deleteSpell(id)
    this.agent.emit('spell:deleted', id)
  }

  async getSpellsForChannel(): Promise<ISpell[]> {
    return this.getSpells()
  }
}
