// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { oauth, OAuthStrategy } from '@feathersjs/authentication-oauth'

import type { Application } from './declarations'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

export const authentication = (app: Application) => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('google', new OAuthStrategy())
  authentication.register('facebook', new OAuthStrategy())
  authentication.register('twitter', new OAuthStrategy())
  authentication.register('github', new OAuthStrategy())
  authentication.register('auth0', new OAuthStrategy())

  app.use('authentication', authentication)
  app.configure(oauth())
}
