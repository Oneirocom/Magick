import {
  AuthenticationParams,
  AuthenticationRequest,
  AuthenticationResult,
  AuthenticationService,
} from '@feathersjs/authentication'
import { jwtDecrypt } from 'jose'
import hkdf from '@panva/hkdf'
import { NotAuthenticated } from '@feathersjs/errors/lib'
import jsonwebtoken, { Secret, VerifyOptions } from 'jsonwebtoken'

export interface JwtVerifyOptions extends VerifyOptions {
  algorithm?: string | string[]
}

async function getDerivedEncryptionKey(secret: string | Buffer) {
  return await hkdf(
    'sha256',
    secret,
    '',
    'NextAuth.js Generated Encryption Key',
    32
  )
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
    token: string,
    optsOverride?: JwtVerifyOptions,
    secretOverride?: string
  ) {
    const { secret } = this.configuration
    const encryptionSecret = await getDerivedEncryptionKey(
      secretOverride || secret
    )

    try {
      const { payload } = await jwtDecrypt(token, encryptionSecret, {
        clockTolerance: 15,
      })

      return payload as any
    } catch (error: any) {
      throw new NotAuthenticated(error.message, error)
    }
  }

  async authenticate(
    authentication: AuthenticationRequest,
    params: AuthenticationParams,
    ...allowed: string[]
  ): Promise<AuthenticationResult> {
    // console.log('authenticate', authentication, params, allowed)
    const result = await super.authenticate(authentication, params, ...allowed)
    return result
  }
}
