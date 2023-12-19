import knex from 'knex'
import { CREDENTIALS_ENCRYPTION_KEY, DATABASE_URL } from 'shared/config'
import { encrypt, decrypt } from './shared'

const db = knex({
  client: 'pg',
  connection: {
    connectionString: DATABASE_URL,
  },
  useNullAsDefault: true,
})

export type CredentialsPayload = {
  id: string
  projectId: string
  name: string
  serviceType: string
  credentialType: 'core' | 'plugin' | 'custom'
  authType: 'oauth' | 'key' | null
  value: string
  description?: string
  accessToken?: string
  refreshToken?: string
  expiresIn?: Date | null
  scope?: string
  tokenType?: string
  authUrl?: string
  tokenUrl?: string
  metadata?: Record<string, any> | null
  created_at?: Date
  updated_at?: Date
}

class CredentialsManager {
  async storeCredentials(payload: CredentialsPayload): Promise<string> {
    const [credential] = await db('credentials')
      .insert({
        ...payload,
        value: encrypt(
          JSON.stringify(payload.value),
          CREDENTIALS_ENCRYPTION_KEY
        ),
      })
      .returning('id')

    console.log('credential:', credential)
    return credential
  }

  // THIS DECRYPTS THE VALUE
  async retrieveCredentials(
    projectId: string,
    id?: string,
    serviceType?: string
  ): Promise<string | null> {
    try {
      let query = db<CredentialsPayload>('credentials').where({ projectId })

      if (id) {
        query = query.andWhere({ id })
      }

      if (serviceType) {
        query = query.andWhere({ serviceType })
      }

      const result = await query.first()
      if (!result) {
        return null
      } else {
        return decrypt(result.value, CREDENTIALS_ENCRYPTION_KEY)
      }
    } catch (error) {
      console.error('Error retrieving credentials:', error)
      throw new Error('Failed to retrieve credentials')
    }
  }

  async deleteCredentials(id: string): Promise<string> {
    try {
      const deleted: string[] = await db<CredentialsPayload>('credentials')
        .where({ id })
        .returning('id')
        .delete()

      if (deleted.length === 0) {
        throw new Error('No credentials found to delete')
      }

      return deleted[0] // Return the ID of the deleted credential
    } catch (error: any) {
      console.error('Error deleting credentials:', error)
      throw new Error(`Failed to delete credentials: ${error?.message}`)
    }
  }

  // This is used for the server to respond to client sided fetches
  // This is not intended to be used for the server to retrieve credentials
  // It does not return the encrypted value or decrypt it
  // Agents can use retrieveCredentials() to get what they need
  async listCredentials(
    projectId: string
  ): Promise<Partial<CredentialsPayload>[]> {
    return await db<CredentialsPayload>('credentials')
      .where({ projectId: projectId })
      .select(
        'id',
        'projectId',
        'name',
        'serviceType',
        'credentialType',
        'authType',
        'description',
        'created_at',
        'updated_at'
      )
  }
}

export { CredentialsManager }
