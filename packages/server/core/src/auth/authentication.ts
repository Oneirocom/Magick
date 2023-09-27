// DOCUMENTED
/**
 * A module that handles authentication for a FeatherJS application by utilizing the CloudJwtService.
 * @packageDocumentation
 */

import { JWTStrategy } from '@feathersjs/authentication'
import type { Application } from '../declarations'
import { CloudJwtService } from './cloudAuthentication'

/**
 * Extends the ServiceTypes interface in FeatherJS's generated declarations to include the CloudJwtService.
 */
declare module '../declarations' {
  interface ServiceTypes {
    authentication: CloudJwtService
  }
}

/**
 * Registers the CloudJwtService and JWTStrategy with the given FeatherJS application instance.
 *
 * @param {Application} app - The FeatherJS application to register with.
 *
 * @returns {void}
 */
export const authentication = (app: Application): void => {
  const authentication = new CloudJwtService(app)
  authentication.register('jwt', new JWTStrategy())

  app.use('authentication', authentication)
}
