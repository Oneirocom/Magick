// redis.ts
import debug from 'debug'
import core, { SYNC } from './core'
import { RedisPubSub } from '@magickml/redis-pubsub'

const logger = debug('feathers-sync:redis')

interface RedisConfig {
  key: string
  serialize: (data: any) => string
  deserialize: (data: string) => any
  uri: string
}

export default (config: RedisConfig) => {
  return (app: any) => {
    const { key, serialize, deserialize, uri } = config

    const redisPubSub = new RedisPubSub(uri)

    const msgFromRedisHandler = (data: string) => {
      logger(`Got ${key} message from Redis`)
      app.emit('sync-in', data)
    }

    app.configure(core)
    app.sync = {
      deserialize,
      serialize,
      type: 'redis',
      ready: redisPubSub.initialize().then(() => {
        redisPubSub.subscribe(key, msgFromRedisHandler)
      }),
    }

    app.on('sync-out', (data: any) => {
      logger(`Publishing key ${key} to Redis`)
      redisPubSub.publish(key, data)
    })

    app.on(SYNC, () => {
      redisPubSub.close()
    })
  }
}
