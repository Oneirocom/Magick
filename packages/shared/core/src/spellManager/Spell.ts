import { NodeData } from '@magickml/rete'
import { SpellInterface } from '../schemas'

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
