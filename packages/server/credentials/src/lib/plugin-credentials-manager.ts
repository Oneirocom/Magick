import { prismaCore } from '@magickml/server-db'
import { decrypt } from './shared'
import { CREDENTIALS_ENCRYPTION_KEY } from 'shared/config'

// Defines the structure for the plugin credentials, extending a base object type.
export type PluginCredentialsType<T extends object = Record<string, unknown>> =
  T

// Manages the credentials of a plugin, including its initialization, retrieval, update, and removal.
export class PluginCredentialsManager<
  T extends object = Record<string, unknown>
> {
  private plugin: string
  private projectId: string
  private agentId: string
  private currentCredentials: PluginCredentialsType<T> =
    {} as PluginCredentialsType<T>

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

      // decrypt and map them
      const credentials = creds
        ? creds.map(credential => {
            return {
              name: credential.credentials.name,
              value: decrypt(
                credential.credentials.value,
                CREDENTIALS_ENCRYPTION_KEY
              ),
            }
          })
        : {}

      // set the current credentials
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
}
