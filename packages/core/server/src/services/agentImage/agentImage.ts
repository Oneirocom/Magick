const checkPermissions = require('feathers-permissions')
import { Application } from '../../declarations'
import { AgentImageService } from './agentImage.class'

export const agentImage = (app: Application) => {
  app.use('agentImage', new AgentImageService())

  // Add any necessary hooks here
  app.service('agentImage').hooks({
    before: {
      all: [
        checkPermissions({
          roles: ['admin', 'agent'],
        }),
      ],
    },
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    agentImage: AgentImageService
  }
}
