import { prismaCore } from '@magickml/server-db'
import { decrypt } from './shared'
import { CREDENTIALS_ENCRYPTION_KEY } from 'shared/config'
import { PluginCredential } from './credentialsManager'

export type PluginCredentialsType<
  T extends object = Record<string, string | undefined>
> = T

export type ExtractPluginCredentialNames<
  T extends ReadonlyArray<PluginCredential> = ReadonlyArray<PluginCredential>
> = T[number]['name']

// Manages the credentials of a plugin, including its initialization, retrieval, update, and removal.
export class PluginCredentialsManager<
  T extends object = Record<string, unknown>
> {
  private plugin: string
  private projectId: string
  private agentId: string
  private currentCredentials: PluginCredentialsType<T> | undefined

  // Initializes the manager with an agent ID and plugin name.
  constructor(agentId: string, plugin: string, projectId: string) {
    this.plugin = plugin
    this.projectId = projectId
    this.agentId = agentId
  }

  // Initializes the plugin credentials in the database if not already present.
  public async init(): Promise<void> {
    await this.update()
  }

  public async update(): Promise<void> {
    try {
      const creds = await prismaCore.agent_credentials.findMany({
        where: {
          agentId: this.agentId,
          credentials: {
            serviceType: this.plugin,
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
        acc[credential.credentials.name] = decrypt(
          credential.credentials.value,
          CREDENTIALS_ENCRYPTION_KEY
        )
        return acc
      }, {} as PluginCredentialsType<T>)

      this.currentCredentials = credentials as PluginCredentialsType<T>
    } catch (error) {
      throw new Error(
        `Error updating plugin credentials in agent: ${this.agentId}: ${error}`
      )
    }
  }
  // Returns the current credentials of the plugin.
  public getCredentials(): PluginCredentialsType<T> | undefined {
    return this.currentCredentials
  }

  // Returns the current credential of the plugin.
  public getCredential(name: keyof T): T[keyof T] | undefined {
    return this.currentCredentials ? this.currentCredentials[name] : undefined
  }

  // Returns a decreypted custom credential by name.
  public async getCustomCredential(name: string): Promise<string | undefined> {
    const customCredential = await prismaCore.agent_credentials.findFirst({
      where: {
        agentId: this.agentId,
        credentials: {
          serviceType: 'custom',
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

    const value = decrypt(
      customCredential?.credentials.value,
      CREDENTIALS_ENCRYPTION_KEY
    )

    return value
  }
}
