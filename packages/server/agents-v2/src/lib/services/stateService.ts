import { Agent } from '../Agent'
import { Service } from '../core/service'
import { KeyvStateService } from '@magickml/grimoire'
import { RedisServiceType } from './redisService'
import { IStateService } from '@magickml/behave-graph'
import { TYPES } from '../interfaces/types'

@Service([TYPES.RedisService])
export class GraphStateService implements Service<IStateService> {
  apply(): void {}

  getDependencies(agent: Agent): Map<string, IStateService> {
    const redisService = agent.resolve<RedisServiceType>(TYPES.RedisService)
    return new Map([
      [TYPES.GraphStateService, new KeyvStateService(redisService)],
    ])
  }
}
