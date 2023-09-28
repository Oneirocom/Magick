import { NodeData } from 'shared/rete'
import type { SpellInterface } from 'server/core'

export class Spell {
  spell: SpellInterface
  constructor(spell) {
    this.spell = spell
  }

  get publicVariables() {
    if (!this.spell.graph.nodes) return []
    return (Object.values(this.spell.graph.nodes) as NodeData[]).filter(
      node => node?.data?.isPublic
    )
  }
}
