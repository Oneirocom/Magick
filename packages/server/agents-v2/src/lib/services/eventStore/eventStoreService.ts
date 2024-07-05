import { Agent } from '../../Agent'
import { Service } from '../../core/service'
import { TYPES } from '../../interfaces/types'
import { IDatabaseService } from '../../interfaces/database'
import { IEventStore } from '../../interfaces/eventStore'
import { EventStore } from './eventStore'
import { IStateService } from '@magickml/behave-graph'

@Service([TYPES.DatabaseService, TYPES.GraphStateService])
export class EventStoreService implements Service<IEventStore> {
  apply(): void {}

  getDependencies(agent: Agent): Map<string, IEventStore> {
    const database = agent.resolve<IDatabaseService>(TYPES.DatabaseService)

    const stateService = agent.resolve<IStateService>(TYPES.GraphStateService)

    const eventStore = new EventStore({
      stateService,
      agent,
      database,
    })

    return new Map([[TYPES.EventStore, eventStore]])
  }
}
