// agentManager.service.ts

import { Application } from '../../declarations'
import { AgentManagerService } from './agentManager.class'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { toggleRunAllValidator } from './agentManager.schema'
import { checkPermissions } from '../../lib/feathersPermissions'

export * from './agentManager.class'
export * from './agentManager.schema'

export const agentManager = (app: Application) => {
  app.use('agentManager', new AgentManagerService(app), {
    methods: ['toggleRunAll'],
  })

  app.service('agentManager').hooks({
    before: {
      all: [
        checkPermissions({
          roles: ['owner', 'admin'],
        }),
      ],
      toggleRunAll: [schemaHooks.validateData(toggleRunAllValidator)],
    },
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    agentManager: AgentManagerService
  }
}
