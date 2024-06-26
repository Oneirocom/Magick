import { CREDENTIALS_ENCRYPTION_KEY } from '@magickml/server-config'
import { encrypt, decrypt } from './shared'
import { prismaCore, type Prisma } from '@magickml/server-db'

/**
 * Type definition for plugin credentials.
 */
export type PluginCredential = Readonly<{
  name: string
  serviceType: string
  credentialType: 'core' | 'plugin' | 'custom'
  clientName?: string
  initials: string
  description?: string
  icon?: string
  helpLink?: string
  available: boolean
  pluginName: string
}>

/**
 * Type definition for credentials payload.
 */
export type CredentialsPayload = Prisma.credentialsCreateInput

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
/**
 * Manages operations related to credentials in the database using Prisma.
 */
class CredentialsManager {
  /**
   * Stores a new credential in the database.
   * @param payload The credential data to store.
   * @returns The ID of the newly stored credential.
   */
  async storeCredentials(payload: CredentialsPayload): Promise<string> {
    const credential = await prismaCore.credentials.create({
      data: {
        ...payload,
        value: encrypt(
          JSON.stringify(payload.value),
          CREDENTIALS_ENCRYPTION_KEY
        ),
      },
      select: {
        id: true,
      },
    })

    return credential.id
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
      const result = await prismaCore.credentials.findFirst({
        where: {
          projectId: projectId,
          ...(id && { id: id }),
          ...(serviceType && { serviceType: serviceType }),
        },
      })

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
      const deleted = await prismaCore.credentials.delete({
        where: {
          id: id,
        },
        select: {
          id: true,
        },
      })

      return deleted.id
    } catch (error: any) {
      throw new Error(`Failed to delete credentials: ${error?.message}`)
    }
  }

  /**
   * Lists all credentials for a given project.
   * @param projectId The ID of the project.
   * @returns A list of credentials with sensitive data removed.
   */
  async listCredentials(projectId: string) {
    return await prismaCore.credentials.findMany({
      where: {
        projectId: projectId,
      },
      select: {
        id: true,
        projectId: true,
        name: true,
        serviceType: true,
        credentialType: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
    })
  }

  /**
   * Links a credential to an agent.
   * @param payload The agent and credential IDs to link.
   */
  async linkCredentialToAgent(payload: AgentCredentialsPayload) {
    // Check if a link already exists for the given agentId and credentialId
    const existingLink = await prismaCore.agent_credentials.findUnique({
      where: {
        agentId_credentialId: {
          agentId: payload.agentId,
          credentialId: payload.credentialId,
        },
      },
    })

    if (existingLink) {
      // If a link exists, delete it (but keep the credential)
      await prismaCore.agent_credentials.delete({
        where: {
          agentId_credentialId: {
            agentId: payload.agentId,
            credentialId: payload.credentialId,
          },
        },
      })
    }

    // Create a new link
    const linkedCredential = await prismaCore.agent_credentials.create({
      data: {
        agentId: payload.agentId,
        credentialId: payload.credentialId,
      },
      select: {
        credentialId: true,
        credentials: {
          select: {
            name: true,
            serviceType: true,
            credentialType: true,
            pluginName: true,
          },
        },
      },
    })

    return linkedCredential
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
    const credential = await prismaCore.agent_credentials.findFirst({
      where: {
        agentId: agentId,
        credentials: {
          name: name,
          ...(serviceType && { serviceType: serviceType }),
        },
      },
      include: {
        credentials: true,
      },
    })

    if (!credential) return undefined

    return decrypt(credential.credentials.value, CREDENTIALS_ENCRYPTION_KEY)
  }

  /**
   * Lists all credentials linked to an agent.
   * @param agentId The ID of the agent.
   * @returns A list of agent credentials.
   */
  async listAgentCredentials(
    agentId: string
  ): Promise<AgentCredentialsPayload[]> {
    return await prismaCore.agent_credentials.findMany({
      where: {
        agentId: agentId,
      },
      select: {
        agentId: true,
        credentialId: true,
      },
    })
  }

  /**
   * Deletes a credential linked to an agent.
   * @param agentId The ID of the agent.
   * @param credentialId The ID of the credential.
   */
  async deleteAgentCredential(agentId: string, credentialId: string) {
    return await prismaCore.agent_credentials.delete({
      where: {
        agentId_credentialId: {
          agentId: agentId,
          credentialId: credentialId,
        },
      },
      select: {
        credentialId: true,
        credentials: {
          select: {
            serviceType: true,
          },
        },
      },
    })
  }

  // new method now that we use prisma
  async getCredentials(agentId: string) {
    return await prismaCore.agent_credentials.findMany({
      where: {
        agentId: agentId,
      },
      select: {
        created_at: true,
        updated_at: true,
        agentId: true,
        credentialId: true,
        credentials: {
          select: {
            name: true,
            serviceType: true,
            credentialType: true,
            pluginName: true,
            description: true,
          },
        },
      },
    })
  }
}

export { CredentialsManager }
