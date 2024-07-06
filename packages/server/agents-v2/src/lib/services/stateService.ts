import { KeyvStateService } from '@magickml/grimoire'
import { RedisServiceType } from './redisService'
import { IStateService } from '@magickml/behave-graph'
import { TYPES } from '../interfaces/types'
import { Container, injectable } from 'inversify'
import { BaseService, IService } from '../interfaces/IService'

@injectable()
export class GraphStateService extends BaseService implements IService {
  // Constructor injection for required services
  constructor() {
    super()
  }

  static registerDependencies(container: Container): void {
    // Assuming RedisService is already bound elsewhere in the container setup
    container
      .bind<IStateService>(TYPES.GraphStateService)
      .toDynamicValue(context => {
        const redisService = context.container.get<RedisServiceType>(
          TYPES.RedisService
        )
        return new KeyvStateService(redisService)
      })
      .inSingletonScope()
  }

  apply(): void {
    // Implementation for applying service functionality
    // This method would handle any setup required to integrate this service with the agent
  }
}
