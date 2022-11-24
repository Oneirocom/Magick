import { createClient } from 'redis'

export class cacheManager {
  static instance: cacheManager

  client: any

  constructor() {
    cacheManager.instance = this
    this.client = createClient({
      url: process.env.REDIS_URL,
    })
    this.client.on('error', (err: any) =>
      console.log('Redis client error:', err)
    )
    this.client.connect()
  }

  async get(key: string) {
    if (await this.client.exists(key)) {
      return await this.client.get(key)
    } else {
      return ''
    }
  }
  async set(key: string, value: any) {
    if (!key || key === undefined || !value || value === undefined) {
      return
    }

    await this.client.set(key, value)
  }

  async _delete(key: string) {
    if (await this.client.exists(key)) {
      await this.client.del(key)
    }
  }
  async clear() {
    await this.client.flushAll()
  }
  async disconnect() {
    this.client.disconnect()
  }

  async has(key: string) {
    return (await this.client.exists(key)) > 0
  }
}
