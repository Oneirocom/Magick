import {
  AuthenticationParams,
  AuthenticationRequest,
  AuthenticationResult,
  AuthenticationService,
} from '@feathersjs/authentication'
import { NotAuthenticated } from '@feathersjs/errors/lib'
import jsonwebtoken, { Secret, VerifyOptions } from 'jsonwebtoken'

export interface JwtVerifyOptions extends VerifyOptions {
  algorithm?: string | string[]
}

export class CloudJwtService extends AuthenticationService {
  async getPayload(authResult, params) {
    // Call original `getPayload` first
    console.log('getPayload', authResult, params)
    const payload = await super.getPayload(authResult, params)
    const { user } = authResult

    if (user && user.permissions) {
      payload.permissions = user.permissions
    }

    return payload
  }

  async verifyAccessToken(
    accessToken: string,
    optsOverride?: JwtVerifyOptions,
    secretOverride?: Secret
  ) {
    const { secret, jwtOptions } = this.configuration
    const jwtSecret = secretOverride || secret
    const options = {
      ...jwtOptions,
      ...optsOverride,
    }
    const { algorithm } = options

    // Normalize the `algorithm` setting into the algorithms array
    if (algorithm && !options.algorithms) {
      // @ts-ignore
      options.algorithms = (Array.isArray(algorithm)
        ? algorithm
        : [algorithm]) as unknown as Algorithm[]
      delete options.algorithm
    }

    try {
      const verified = jsonwebtoken.verify(accessToken, jwtSecret, options)

      return verified as any
    } catch (error: any) {
      throw new NotAuthenticated(error.message, error)
    }
  }

  async authenticate(
    authentication: AuthenticationRequest,
    params: AuthenticationParams,
    ...allowed: string[]
  ): Promise<AuthenticationResult> {
    console.log('authenticate', authentication, params, allowed)
    const result = await super.authenticate(authentication, params, ...allowed)
    console.log('authenticate result', result)
    return result
  }
}
