// DOCUMENTED
import {
  AuthenticationParams,
  AuthenticationRequest,
  AuthenticationResult,
  AuthenticationService,
} from '@feathersjs/authentication'
import { jwtDecrypt } from 'jose'
import hkdf from '@panva/hkdf'
import { NotAuthenticated } from '@feathersjs/errors/lib'

/**
 * Generates an encryption key using hkdf
 * @param secret - Secret string or buffer for encryption
 * @returns a 32-byte encryption key
 */
async function getDerivedEncryptionKey(secret: string | Buffer) {
  return await hkdf(
    'sha256',
    secret,
    '',
    'NextAuth.js Generated Encryption Key',
    32
  )
}

/**
 * Cloud JWT Service class
 */
export class CloudJwtService extends AuthenticationService {
  /**
   * Extend the default getPayload method with permissions
   * @param authResult - The result of the authentication
   * @param params - The parameters required for authentication
   * @returns payload with permissions if exists
   */
  async getPayload(authResult, params) {
    // Call original `getPayload` first
    const payload = await super.getPayload(authResult, params)
    const { user } = authResult

    // Add user permissions to payload if available
    if (user && user.permissions) {
      payload.permissions = user.permissions
    }

    return payload
  }

  /**
   * Verify an access token
   * @param token - Access token string
   * @param _optsOverride - Options to override the derive encryption key
   * @param secretOverride - Override the secret used for encryption
   * @returns decrypted token payload
   */
  async verifyAccessToken(
    token: string,
    _optsOverride,
    secretOverride?: string
  ) {
    // Get secret from the configuration or use the override
    const { secret } = this.configuration
    const encryptionSecret = await getDerivedEncryptionKey(
      secretOverride || secret
    )

    // Decrypt and verify the token
    try {
      const { payload } = await jwtDecrypt(token, encryptionSecret, {
        clockTolerance: 15,
      })
      return payload as any
    } catch (error: any) {
      // Throw a NotAuthenticated error if token verification fails
      throw new NotAuthenticated(error.message, error)
    }
  }

  /**
   * Authenticate method
   * @param authentication - Authentication request
   * @param params - Authentication parameters
   * @param allowed - Allowed authentication strategies
   * @returns Authentication result
   */
  async authenticate(
    authentication: AuthenticationRequest,
    params: AuthenticationParams,
    ...allowed: string[]
  ): Promise<AuthenticationResult> {
    // Call the default authenticate method
    const result = await super.authenticate(authentication, params, ...allowed)
    return result
  }
}
