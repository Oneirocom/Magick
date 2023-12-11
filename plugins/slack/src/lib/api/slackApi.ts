import { SlackService } from './slackApi.class'
import { Application } from '@feathersjs/feathers'
import { RedisPubSub } from 'packages/server/redis-pubsub/src'

export const slackApi = (app: Application) => {
  app.use('slack', new SlackService(new RedisPubSub()), {
    methods: ['create'],
  })

  app.service('slack').hooks({
    around: {},
    before: {
      all: [],
      create: [],
    },
    after: {
      create: [],
    },
    error: {
      all: [],
    },
  })
}
