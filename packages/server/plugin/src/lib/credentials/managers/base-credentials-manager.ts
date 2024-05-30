import { prismaCore } from '@magickml/server-db'
import { decrypt } from 'server/credentials'
import { CREDENTIALS_ENCRYPTION_KEY } from 'shared/config'
import {
  PluginCredentialsManager,
  PluginCredentialsType,
} from '../plugin-credentials-manager'

export class BaseCredentialsManager<
  T extends object = Record<string, unknown>
> extends PluginCredentialsManager<T> {
  async init(): Promise<void> {
    await this.update()
  }

  async update(): Promise<void> {
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

      const credentials = creds.reduce(
        (acc: PluginCredentialsType<T>, credential) => {
          // @ts-ignore
          acc[credential.credentials.name] = decrypt(
            credential.credentials.value,
            CREDENTIALS_ENCRYPTION_KEY
          )
          return acc
        },
        {} as PluginCredentialsType<T>
      )

      this.currentCredentials = credentials as PluginCredentialsType<T>
    } catch (error) {
      throw new Error(
        `Error updating plugin credentials in agent: ${this.agentId}: ${error}`
      )
    }
  }

  getCredentials(): PluginCredentialsType<T> | undefined {
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

    if (!customCredential) return undefined

    const value = decrypt(
      customCredential.credentials.value,
      CREDENTIALS_ENCRYPTION_KEY
    )

    return value
  }

  async validateCredentials(credentials: T): Promise<boolean> {
    return credentials !== undefined
  }

  getRequiredCredentials(): (keyof T)[] {
    return [] as (keyof T)[]
  }
}
