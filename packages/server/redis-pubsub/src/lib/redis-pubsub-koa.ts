import { Application } from '@feathersjs/koa/lib'
import { RedisPubSub } from './redis-pubsub'

export const koaPubSub = async (redisCloudUrl: string) => {
  const pubsub = new RedisPubSub()

  await pubsub.initialize(redisCloudUrl)

  return (app: Application) => {
    app.set('pubsub', pubsub)
  }
}
