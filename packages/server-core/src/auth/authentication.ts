import { JWTStrategy } from '@feathersjs/authentication'
import type { Application } from '../declarations'
import { CloudJwtService } from './cloudAuthentication'

declare module '../declarations' {
  interface ServiceTypes {
    authentication: CloudJwtService
  }
}

export const authentication = (app: Application) => {
  const authentication = new CloudJwtService(app)

  authentication.register('jwt', new JWTStrategy())

  app.use('authentication', authentication)
}
