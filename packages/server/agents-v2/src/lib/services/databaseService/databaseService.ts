import { Agent } from '../../Agent'
import { Service } from '../../core/service'
import { TYPES } from '../../interfaces/types'
import { GraphEvent, IDatabaseService } from '../../interfaces/database'

class FeathersDatabase implements IDatabaseService {
  async saveGraphEvent(graphEvent: GraphEvent): Promise<void> {
    console.log('Saving graph event', graphEvent)
  }

  async queryEvents(): Promise<any> {
    console.log('Querying events')
  }

  async deleteMessages(): Promise<void> {
    console.log('Deleting messages')
  }
}

@Service()
export class DatabaseService implements Service<IDatabaseService> {
  apply(): void {}

  getDependencies(agent: Agent): Map<string, IDatabaseService> {
    return new Map([[TYPES.DatabaseService, new FeathersDatabase()]])
  }
}
