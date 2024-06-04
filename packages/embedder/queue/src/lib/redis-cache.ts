import { Redis, RedisOptions } from 'ioredis'
import { BaseCache } from '@llm-tools/embedjs'

export class RedisCache implements BaseCache {
  private readonly options: RedisOptions
  private redis: Redis

  constructor(options: RedisOptions) {
    options.keyPrefix = options.keyPrefix ?? 'REDIS_CACHE'
    this.options = options
  }

  async init(): Promise<void> {
    this.redis = new Redis(this.options)
  }

  async addLoader(loaderId: string, chunkCount: number): Promise<void> {
    await this.redis.set(loaderId, JSON.stringify({ chunkCount }))
  }

  async getLoader(loaderId: string): Promise<{ chunkCount: number } | null> {
    const result = await this.redis.get(loaderId)

    if (!result) return null
    return JSON.parse(result)
  }

  async hasLoader(loaderId: string): Promise<boolean> {
    return !!(await this.redis.get(loaderId))
  }

  async loaderCustomSet<T extends Record<string, unknown>>(
    loaderCombinedId: string,
    value: T
  ): Promise<void> {
    await this.redis.set(loaderCombinedId, JSON.stringify(value))
  }

  async loaderCustomGet<T extends Record<string, unknown>>(
    loaderCombinedId: string
  ): Promise<T> {
    const result = await this.redis.get(loaderCombinedId)

    if (!result) return null
    return JSON.parse(result)
  }

  async loaderCustomHas(loaderCombinedId: string): Promise<boolean> {
    return !!(await this.redis.get(loaderCombinedId))
  }

  async deleteLoader(loaderId: string): Promise<void> {
    await this.redis.del(loaderId)
  }

  async loaderCustomDelete(loaderCombinedId: string): Promise<void> {
    await this.redis.del(loaderCombinedId)
  }
}
