import knex from 'knex'
import { CREDENTIALS_ENCRYPTION_KEY, DATABASE_URL } from 'shared/config'
import { encrypt, decrypt } from './shared'

/**
 * Initializes a Knex instance for Postgres database connection.
 */
const db = knex({
  client: 'pg',
  connection: {
    connectionString: DATABASE_URL || '',
  },
  useNullAsDefault: true,
})

/**
 * Type definition for plugin credentials.
 */
export type PluginCredential = {
  name: string
  serviceType: string
  credentialType: 'core' | 'plugin' | 'custom'
  clientName?: string
  initials: string
  description?: string
  icon?: string
  helpLink?: string
  available: boolean
}

/**
 * Type definition for credentials payload.
 */
export type CredentialsPayload = {
  id: string
  projectId: string
  name: string
  serviceType: string
  credentialType: 'core' | 'plugin' | 'custom'
  value: string
  description?: string
  metadata?: Record<string, any> | null
  created_at?: Date
  updated_at?: Date
}

/**
 * Type definition for agent credentials payload.
 */
export type AgentCredentialsPayload = {
  agentId: string
  credentialId: string
}

/**
 * Manages operations related to credentials in the database.
 */
class CredentialsManager {
  /**
   * Stores a new credential in the database.
   * @param payload The credential data to store.
   * @returns The ID of the newly stored credential.
   */
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

    return credential
  }

  /**
   * Retrieves credentials from the database.
   * @param projectId The ID of the project.
   * @param id Optional ID of the credential.
   * @param serviceType Optional service type of the credential.
   * @returns The decrypted credential value.
   */
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
      throw new Error('Failed to retrieve credentials')
    }
  }

  /**
   * Deletes a credential from the database.
   * @param id The ID of the credential to delete.
   * @returns The ID of the deleted credential.
   */
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
      throw new Error(`Failed to delete credentials: ${error?.message}`)
    }
  }

  /**
   * Lists all credentials for a given project.
   * @param projectId The ID of the project.
   * @returns A list of credentials with sensitive data removed.
   */
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
        'description',
        'created_at',
        'updated_at'
      )
  }

  /**
   * Links a credential to an agent.
   * @param payload The agent and credential IDs to link.
   */
  async linkCredentialToAgent(payload: AgentCredentialsPayload): Promise<void> {
    const existingLinkedCredentials = await db('agent_credentials')
      .join('credentials', 'credentials.id', 'agent_credentials.credentialId')
      .where('agent_credentials.agentId', payload.agentId)
      .select(
        'credentials.name',
        'credentials.serviceType',
        'credentials.credentialType',
        'agent_credentials.credentialId'
      )

    const credentialToLink = await db('credentials')
      .where('id', payload.credentialId)
      .first()

    const duplicate = existingLinkedCredentials.find(
      ec =>
        ec.name === credentialToLink.name &&
        ec.serviceType === credentialToLink.serviceType &&
        ec.credentialType === credentialToLink.credentialType
    )

    if (duplicate) {
      await db('agent_credentials')
        .where({ credentialId: duplicate.credentialId })
        .delete()
    }

    await db('agent_credentials').insert(payload)
  }

  /**
   * Retrieves credentials linked to an agent.
   * @param agentId The ID of the agent.
   * @param name The name of the credential.
   * @param serviceType Optional service type.
   * @returns The decrypted credential value.
   */
  async retrieveAgentCredentials(
    agentId: string,
    name: string,
    serviceType?: string
  ): Promise<string | undefined> {
    const query = db('agent_credentials')
      .join('credentials', 'credentials.id', 'agent_credentials.credentialId')
      .where('credentials.name', name)
      .where('agent_credentials.agentId', agentId)

    if (serviceType) {
      query.andWhere('credentials.serviceType', serviceType)
    }

    const credential = await query.first('credentials.*')

    if (!credential) return undefined

    return decrypt(credential.value, CREDENTIALS_ENCRYPTION_KEY)
  }

  /**
   * Lists all credentials linked to an agent.
   * @param agentId The ID of the agent.
   * @returns A list of agent credentials.
   */
  async listAgentCredentials(
    agentId: string
  ): Promise<AgentCredentialsPayload[]> {
    return await db('agent_credentials').where({ agentId }).select('*')
  }

  /**
   * Deletes a credential linked to an agent.
   * @param agentId The ID of the agent.
   * @param credentialId The ID of the credential.
   */
  async deleteAgentCredential(
    agentId: string,
    credentialId: string
  ): Promise<void> {
    await db('agent_credentials')
      .where({
        agentId: agentId,
        credentialId: credentialId,
      })
      .delete()
  }
}

export { CredentialsManager }
