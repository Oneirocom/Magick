import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  slackExternalResolver,
  slackResolver,
  slackValidator,
} from './slack.schema'
import type { Application, HookContext } from '@magickml/server-core'
import { SlackService } from './slack.class'

declare module '@magickml/server-core' {
  interface ServiceTypes {
    [slackPath]: SlackService
  }
}
const extractAgentIdMiddleware = async (context: HookContext) => {
  const agentId = context.params.query?.agentId
  if (agentId) {
    context.params.agentId = agentId
    console.log('Extracted agentId:', context.params.agentId)
  } else {
    console.log('No agentId found in the query parameters')
  }
  return context
}

export const slackPath = 'slack'

export const slackMethods = ['create'] as const

export * from './slack.class'
export * from './slack.schema'

export const slack = (app: Application) => {
  app.use(slackPath, new SlackService(), {
    methods: ['create'],
    events: [],
  })
  app.service(slackPath).hooks({
    around: {
      all: [
        // schemaHooks.resolveExternal(slackExternalResolver),
        // schemaHooks.resolveResult(slackResolver),
      ],
    },
    before: {
      create: [
        extractAgentIdMiddleware,
        // schemaHooks.validateData(slackValidator),
        // schemaHooks.resolveData(slackResolver),
      ],
    },
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  } as any)
}
