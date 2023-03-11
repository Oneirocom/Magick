import {
  AuthenticationParams,
  AuthenticationRequest,
  AuthenticationResult,
  AuthenticationService,
} from '@feathersjs/authentication'
import { jwtDecrypt } from 'jose'
import hkdf from '@panva/hkdf'
import { NotAuthenticated } from '@feathersjs/errors/lib'

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
    const payload = await super.getPayload(authResult, params)
    const { user } = authResult

    if (user && user.permissions) {
      payload.permissions = user.permissions
    }

    return payload
  }

  async verifyAccessToken(
    token: string,
    _optsOverride,
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

      console.log('payload', payload)

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
    const result = await super.authenticate(authentication, params, ...allowed)
    return result
  }
}
