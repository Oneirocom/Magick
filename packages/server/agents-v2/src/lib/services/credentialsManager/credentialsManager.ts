import 'reflect-metadata'

import { prismaCore } from '@magickml/server-db'
import {
  CredentialKeyValuePair,
  ICredentialManager,
  Credential,
} from '../../interfaces/ICredentialsManager'
import { decrypt, encrypt } from '@magickml/credentials'
import { CREDENTIALS_ENCRYPTION_KEY } from '@magickml/server-config'
import { Agent } from '../../Agent'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../dependencies/dependency.config'

@injectable()
export class CredentialManager implements ICredentialManager {
  protected worldId: string
  protected agentId: string
  protected cachedCredentials: CredentialKeyValuePair[] = []

  constructor(@inject(TYPES.Agent) private agent: Agent) {
    this.worldId = this.agent.config.options.worldId
    this.agentId = this.agent.config.options.agentId
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
            worldId: this.worldId,
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
        value: credential.credentials.value,
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
          worldId: this.worldId,
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
        worldId: this.worldId,
      },
    })

    if (existingCredential) {
      throw new Error(`Credential ${credential.name} already exists`)
    }

    const createdCredential = await prismaCore.credentials.create({
      data: {
        id: credential.id || undefined,
        name: credential.name,
        value: encrypt(credential.value, CREDENTIALS_ENCRYPTION_KEY),
        serviceType: credential.serviceType,
        worldId: this.worldId,
        projectId: '',
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

  async updateCredential(credential: Partial<Credential>): Promise<boolean> {
    const existingCredential = await prismaCore.credentials.findFirst({
      where: {
        name: credential.name,
        serviceType: credential?.serviceType,
        worldId: this.worldId,
      },
    })

    if (!existingCredential) {
      throw new Error(`Credential ${credential.name} not found`)
    }
    const { value, id, credentialType } = credential

    if (!value && !id && !credentialType) {
      throw new Error('value, id and credentialType are required')
    }

    await prismaCore.credentials.update({
      where: { id: existingCredential.id },
      data: {
        value: encrypt(credential.value || '', CREDENTIALS_ENCRYPTION_KEY),
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
            worldId: this.worldId,
          },
        },
      })

      // Then, delete the credential itself
      await prismaCore.credentials.deleteMany({
        where: {
          name: name as string,
          worldId: this.worldId,
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
