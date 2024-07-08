import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import Redis from 'ioredis'
import { AgentConfigOptions } from '../Agent'

declare module '../Agent' {
  interface AgentConfigOptions {
    redisUrl: string
  }
}

@injectable()
export class RedisClientWrapper {
  private redis: Redis

  constructor(@inject('AgentConfigOptions') configOptions: AgentConfigOptions) {
    this.redis = new Redis(configOptions.redisUrl, {
      maxRetriesPerRequest: null,
    })
  }

  getClient(): Redis {
    return this.redis
  }
}
