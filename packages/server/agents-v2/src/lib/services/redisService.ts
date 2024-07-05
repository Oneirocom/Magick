import Redis from 'ioredis'
import { Agent } from '../Agent'
import { Service } from '../core/service'
import { TYPES } from '../interfaces/types'

declare module '../Agent' {
  interface AgentConfigOptions {
    redisUrl: string
  }
}

export type RedisServiceType = Redis

@Service()
export class RedisService implements Service {
  apply() {}

  getDependencies(agent: Agent): Map<string, any> {
    const redisUrl = agent.config.options.redisUrl

    const redis = new Redis(redisUrl as string, {
      maxRetriesPerRequest: null,
    })

    return new Map([[TYPES.RedisService, redis]])
  }
}
