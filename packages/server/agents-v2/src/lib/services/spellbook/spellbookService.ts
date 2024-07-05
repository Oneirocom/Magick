import { EventPayload } from '../../interfaces/IEvent'
import { ISpellCaster } from '../../interfaces/spellcaster'
import { Spellbook } from './spellbook'
import { Agent } from '../../Agent'
import { TYPES } from '../../interfaces/types'
import { ISpellbook } from '../../interfaces/spellbook'
import { IStateService } from '@magickml/behave-graph'
import { Service } from '../../core/service'

declare module '../../Agent' {
  interface Agent {
    loadSpell(spellId: string, spell: any, channel: string): void
    unloadSpell(spellId: string): void
    getSpellCaster(spellId: string): ISpellCaster | undefined
  }

  interface BaseAgentEvents {
    spellLoaded: (spellId: string, channel: string) => void
    spellUnloaded: (spellId: string) => void
    eventRouted: (channel: string, event: EventPayload) => void
  }
}

@Service([TYPES.GraphStateService])
export class SpellbookService implements Service<ISpellbook> {
  apply(agent: Agent): void {
    const spellbook = agent.resolve<ISpellbook>(TYPES.Spellbook)

    // Add Spellbook methods to the agent
    agent.loadSpell = (spellId: string, spell: any, channel: string) => {
      spellbook.loadSpell(spellId, spell, channel)
    }

    agent.unloadSpell = (spellId: string) => {
      spellbook.unloadSpell(spellId)
    }

    agent.getSpellCaster = (spellId: string) => {
      return spellbook.getSpellCaster(spellId)
    }

    // Set up event routing
    // agent.on('event', (event: EventPayload) => spellbook.routeEvent(event))
  }

  getDependencies(agent: Agent): Map<string, ISpellbook> {
    const stateService = agent.resolve<IStateService>(TYPES.GraphStateService)

    const spellbook = new Spellbook(agent, stateService)

    return new Map([[TYPES.Spellbook, spellbook]])
  }
}
