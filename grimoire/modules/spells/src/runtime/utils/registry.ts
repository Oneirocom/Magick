import type { Spell, SpellRegistry } from '../../types'

// This is a mock of our existing system
export class SpellRegistryManager implements SpellRegistry {
  private spells: Map<string, Spell> = new Map()

  get(id: string): Spell | undefined {
    return this.spells.get(id)
  }

  getAll(): Spell[] {
    return Array.from(this.spells.values())
  }

  add(spell: Spell): void {
    if (this.spells.has(spell.id)) {
      console.warn(`Spell with id "${spell.id}" already exists. Overwriting.`)
    }
    this.spells.set(spell.id, spell)
  }

  remove(id: string): void {
    this.spells.delete(id)
  }

  update(id: string, spellUpdate: Partial<Spell>): void {
    const existingSpell = this.spells.get(id)
    if (!existingSpell) {
      throw new Error(`Spell with id "${id}" not found.`)
    }
    this.spells.set(id, { ...existingSpell, ...spellUpdate })
  }
}

export const spellRegistry = new SpellRegistryManager()
