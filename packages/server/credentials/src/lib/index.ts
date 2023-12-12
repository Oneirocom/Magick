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
  credentialType: 'oauth' | 'key'
  value: string
  description: string | null
  accessToken: string | null
  refreshToken: string | null
  expiresIn: Date | null
  metadata: object | null
  createdAt: Date
  updatedAt: Date
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

  async retrieveCredentials(
    projectId: string,
    id?: string,
    serviceType?: string
  ): Promise<CredentialsPayload | null> {
    try {
      let query = db<CredentialsPayload>('credentials').where({ projectId })

      if (id) {
        query = query.andWhere({ id })
      }

      if (serviceType) {
        query = query.andWhere({ serviceType })
      }

      const result = await query.first()
      if (!result) return null

      const decryptedValue = decrypt(result.value, CREDENTIALS_ENCRYPTION_KEY)

      return {
        ...result,
        value: JSON.parse(decryptedValue),
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

  async listCredentials(
    projectId: string
  ): Promise<Partial<CredentialsPayload>[]> {
    const credentials = await db<CredentialsPayload>('credentials')
      .where({
        projectId,
      })
      .select(
        'id',
        'projectId',
        'name',
        'serviceType',
        'credentialType',
        'description',
        'createdAt',
        'updatedAt'
      )

    return credentials
  }
}

export { CredentialsManager }
