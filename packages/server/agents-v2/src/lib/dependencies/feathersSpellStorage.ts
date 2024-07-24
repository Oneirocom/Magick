import { Application } from '@feathersjs/feathers'
import { inject, injectable } from 'inversify'
import { ISpellStorage } from '../interfaces/ISpellStorage'
import { ISpell } from '../interfaces/spell'
import { Agent } from '../Agent'
import { TYPES } from './dependency.config'

// declare module '../Agent' {
//   interface BaseAgentEvents {
//     'spells:loaded': (spells: ISpell[]) => Promise<void> | void
//     'spell:created': (spell: ISpell) => Promise<void> | void
//     'spell:updated': (spell: ISpell) => Promise<void> | void
//     'spell:deleted': (id: string) => Promise<void> | void
//   }
// }

@injectable()
export class FeathersSpellStorage implements ISpellStorage {
  constructor(
    @inject(TYPES.Agent) private agent: Agent,
    private app: Application
  ) {}

  async initialize(): Promise<void> {
    this.app
      .service('spells')
      .on('created', (spell: ISpell) => this.agent.emit('spell:created', spell))
    this.app
      .service('spells')
      .on('updated', (spell: ISpell) => this.agent.emit('spell:updated', spell))
    this.app
      .service('spells')
      .on('removed', (id: string) => this.agent.emit('spell:deleted', id))

    // Initial load
    const spells = await this.loadSpells()
    this.agent.emit('spells:loaded', spells)
  }

  async loadSpells(): Promise<ISpell[]> {
    return this.app.service('spells').find()
  }

  async getSpell(id: string): Promise<ISpell | null> {
    try {
      return await this.app.service('spells').get(id)
    } catch (error) {
      return null
    }
  }

  async saveSpell(spell: ISpell): Promise<ISpell> {
    if (spell.id) {
      return await this.app.service('spells').update(spell.id, spell)
    } else {
      return await this.app.service('spells').create(spell)
    }
  }

  async deleteSpell(id: string): Promise<void> {
    await this.app.service('spells').remove(id)
  }
}
