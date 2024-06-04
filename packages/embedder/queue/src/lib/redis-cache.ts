// SEE: https://github.com/llm-tools/embedJs/issues/25
// SEE: https://github.com/llm-tools/embedJs/issues/38
// I yoinked this from here: https://github.com/llm-tools/embedJs/blob/main/src/cache/redis-cache.ts
// There seems to be broken exports. Seems to mainly affect monorepos.
// One thing to note is the @ts-ignore comments I added.
// Maybe they are not in the published version because this file has errors
// Or maybe they are in the published version, and our monorepo wont pick them up because they are broken
// I'm going to fork it and nx-ify it and make a PR
// If they accept it great, if not I'll move the packages into this monorepo


import { Redis, RedisOptions } from 'ioredis'
import { BaseCache } from '@llm-tools/embedjs'

export class RedisCache implements BaseCache {
  private readonly options: RedisOptions
  // @ts-ignore
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

  // @ts-ignore
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

    if (!result) return null as any
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
