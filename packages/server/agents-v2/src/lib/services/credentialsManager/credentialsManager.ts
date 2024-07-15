import { prismaCore } from '@magickml/server-db'
import { decrypt, encrypt, PluginCredential } from '@magickml/credentials'
import { CREDENTIALS_ENCRYPTION_KEY } from '@magickml/server-config'
import { ICredentialManager } from '../../interfaces/ICredentialsManager'

export type CredentialsType<
  T extends object = Record<string, string | undefined>
> = T
export class CredentialManager<T extends object = Record<string, unknown>>
  implements ICredentialManager<T>
{
  protected projectId: string
  protected agentId: string
  protected currentCredentials: CredentialsType<T> | undefined

  constructor(agentId: string, projectId: string) {
    this.projectId = projectId
    this.agentId = agentId
  }

  async init(): Promise<void> {
    await this.update()
  }

  async update(): Promise<void> {
    try {
      const creds = await prismaCore.agent_credentials.findMany({
        where: {
          agentId: this.agentId,
          credentials: {
            serviceType: 'core',
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

      const credentials = creds.reduce((acc, credential) => {
        // @ts-ignore
        acc[credential.credentials.name] = decrypt(
          credential.credentials.value,
          CREDENTIALS_ENCRYPTION_KEY
        )
        return acc
      }, {})

      this.currentCredentials = credentials as CredentialsType<T>
    } catch (error) {
      throw new Error(
        `Error updating plugin credentials in agent: ${this.agentId}: ${error}`
      )
    }
  }

  getCredentials(): CredentialsType<T> | undefined {
    return this.currentCredentials
  }

  getCredential(name: keyof T): T[keyof T] | undefined {
    return this.currentCredentials ? this.currentCredentials[name] : undefined
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

  async addCredential(
    credential: Partial<T>,
    pluginCredential: PluginCredential
  ): Promise<void> {
    for (const [name, value] of Object.entries(credential)) {
      // First, try to find an existing credential
      const existingCredential = await prismaCore.credentials.findFirst({
        where: {
          name: name,
          serviceType: pluginCredential.serviceType,
          projectId: this.projectId,
        },
      })

      if (existingCredential) {
        // Update the existing credential
        await prismaCore.credentials.update({
          where: { id: existingCredential.id },
          data: {
            value: encrypt(value as string, CREDENTIALS_ENCRYPTION_KEY),
            credentialType: pluginCredential.credentialType,
            description: pluginCredential.description,
            pluginName: pluginCredential.pluginName,
          },
        })
      } else {
        // Create a new credential
        const createdCredential = await prismaCore.credentials.create({
          data: {
            name: name,
            value: encrypt(value as string, CREDENTIALS_ENCRYPTION_KEY),
            serviceType: pluginCredential.serviceType,
            projectId: this.projectId,
            credentialType: pluginCredential.credentialType,
            description: pluginCredential.description,
            pluginName: pluginCredential.pluginName,
          },
        })

        // Link the new credential to the agent
        await prismaCore.agent_credentials.create({
          data: {
            agentId: this.agentId,
            credentialId: createdCredential.id,
          },
        })
      }
    }
    await this.update()
  }

  async deleteCredential(name: keyof T): Promise<void> {
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

    await this.update()
  }

  async validateCredential(name: keyof T): Promise<boolean> {
    const credential = this.getCredential(name)
    return credential !== undefined && credential !== null
  }

  getRequiredCredentials(): (keyof T)[] {
    // Implement your logic to return required credentials
    return [] as (keyof T)[]
  }
}
