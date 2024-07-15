import { CREDENTIALS_ENCRYPTION_KEY } from '../../../../../config/src'
import { decrypt, encrypt } from '../../../../../credentials/src'
import { prismaCore } from '../../../../../db/src'
import {
  CredentialKeyValuePair,
  ICredentialManager,
  Credential,
} from '../../interfaces/ICredentialsManager'

export class CredentialManager implements ICredentialManager {
  protected projectId: string
  protected agentId: string
  protected cachedCredentials: CredentialKeyValuePair[] = []

  constructor(agentId: string, projectId: string) {
    this.projectId = projectId
    this.agentId = agentId
  }

  async init(): Promise<void> {
    await this.refreshCredentialsCache()
  }

  async getCredentials(): Promise<CredentialKeyValuePair[]> {
    if (this.cachedCredentials.length === 0) {
      await this.refreshCredentialsCache()
    }
    const credentials = this.cachedCredentials.map(credential => ({
      name: credential.name,
      value: credential.value,
      serviceType: 'core',
    }))
    return credentials
  }

  async refreshCredentialsCache(): Promise<void> {
    try {
      const creds = await prismaCore.agent_credentials.findMany({
        where: {
          agentId: this.agentId,
          credentials: {
            projectId: this.projectId,
          },
        },
        include: {
          credentials: {
            select: {
              name: true,
              value: true,
            },
          },
        },
      })

      const credentials = creds.map(credential => ({
        name: credential.credentials.name,
        value: decrypt(
          credential.credentials.value,
          CREDENTIALS_ENCRYPTION_KEY
        ),
      })) as CredentialKeyValuePair[]

      this.cachedCredentials = credentials
    } catch (error) {
      throw new Error(
        `Error fetching plugin credentials for agent: ${this.agentId}: ${error}`
      )
    }
  }

  getCredential(name: string): string | undefined {
    const credential = this.cachedCredentials.find(cred => cred.name === name)

    return credential
      ? decrypt(credential.value, CREDENTIALS_ENCRYPTION_KEY)
      : undefined
  }

  async getCustomCredential(name: string): Promise<string | undefined> {
    const customCredential = await prismaCore.agent_credentials.findFirst({
      where: {
        agentId: this.agentId,
        credentials: {
          credentialType: 'custom',
          projectId: this.projectId,
          name,
        },
      },
      select: {
        credentials: {
          select: {
            value: true,
          },
        },
      },
    })

    if (!customCredential?.credentials) return undefined

    return decrypt(
      customCredential.credentials.value,
      CREDENTIALS_ENCRYPTION_KEY
    )
  }

  async addCredential(credential: Credential): Promise<{ id: string }> {
    const existingCredential = await prismaCore.credentials.findFirst({
      where: {
        name: credential.name,
        serviceType: credential?.serviceType,
        projectId: this.projectId,
      },
    })

    if (existingCredential) {
      throw new Error(`Credential ${credential.name} already exists`)
    }

    const createdCredential = await prismaCore.credentials.create({
      data: {
        name: credential.name,
        value: encrypt(credential.value, CREDENTIALS_ENCRYPTION_KEY),
        serviceType: credential.serviceType,
        projectId: this.projectId,
        credentialType: credential.credentialType,
        description: credential.description,
      },
    })

    await prismaCore.agent_credentials.create({
      data: {
        agentId: this.agentId,
        credentialId: createdCredential.id,
      },
    })

    await this.refreshCredentialsCache()
    return { id: createdCredential.id }
  }

  async updateCredential(credential: Credential): Promise<boolean> {
    const existingCredential = await prismaCore.credentials.findFirst({
      where: {
        name: credential.name,
        serviceType: credential?.serviceType,
        projectId: this.projectId,
      },
    })

    if (!existingCredential) {
      throw new Error(`Credential ${credential.name} not found`)
    }

    await prismaCore.credentials.update({
      where: { id: existingCredential.id },
      data: {
        value: encrypt(credential.value, CREDENTIALS_ENCRYPTION_KEY),
        credentialType: credential.credentialType,
        description: credential.description,
      },
    })

    await this.refreshCredentialsCache()
    return true
  }

  async deleteCredential(name: string): Promise<boolean> {
    try {
      // First, delete the agent_credentials link
      await prismaCore.agent_credentials.deleteMany({
        where: {
          agentId: this.agentId,
          credentials: {
            name: name as string,
            projectId: this.projectId,
          },
        },
      })

      // Then, delete the credential itself
      await prismaCore.credentials.deleteMany({
        where: {
          name: name as string,
          projectId: this.projectId,
        },
      })

      await this.refreshCredentialsCache()
      return true
    } catch (error) {
      throw new Error(
        `Error deleting credential ${name} for agent: ${this.agentId}: ${error}`
      )
    }
  }

  async validateCredential(name: string): Promise<boolean> {
    const credential = this.getCredential(name)
    return credential !== undefined && credential !== null
  }
}
