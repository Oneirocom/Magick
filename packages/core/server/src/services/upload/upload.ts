import { Application } from '../../declarations'
import { UploadService } from './upload.class'

export const upload = (app: Application) => {
  app.use('upload', new UploadService())

  // Add any necessary hooks here
  app.service('upload').hooks({})
}

declare module '../../declarations' {
  interface ServiceTypes {
    upload: UploadService
  }
}
