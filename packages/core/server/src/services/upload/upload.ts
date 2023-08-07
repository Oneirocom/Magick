// DOCUMENTED
import { Application } from '../../declarations'
import { UploadService } from './upload.class'

export * from './upload.class'
export * from './upload.schema'

/**
 * A configure function that registers the service and its hooks via `app.configure`.
 * @param app - The Feathers application.
 */
export const upload = (app: Application) => {
  // Register our service on the Feathers application
  app.use('upload', new UploadService(), {
    methods: ['find', 'create', 'remove', 'documents'],
    events: [],
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    upload: UploadService
  }
}
