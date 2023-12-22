import { Application } from '@feathersjs/koa/lib'
import { RedisPubSub } from './redis-pubsub'
import { RedisClientOptions } from 'redis'

export const koaPubSub = async (
  redisCloudUrl: string,
  options: RedisClientOptions = {}
) => {
  const pubsub = new RedisPubSub()

  await pubsub.initialize(redisCloudUrl, options)

  return (app: Application) => {
    app.set('pubsub', pubsub)
  }
}
