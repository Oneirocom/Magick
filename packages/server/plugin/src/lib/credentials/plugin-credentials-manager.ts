import { PluginCredential } from '@magickml/credentials'

export type PluginCredentialsType<
  T extends object = Record<string, string | undefined>
> = T

export type ExtractPluginCredentialNames<
  T extends ReadonlyArray<PluginCredential> = ReadonlyArray<PluginCredential>
> = T[number]['name']

export type CreateCredentialsRecord<T extends ReadonlyArray<PluginCredential>> =
  Record<ExtractPluginCredentialNames<T>, string | undefined>

export abstract class PluginCredentialsManager<
  T extends object = Record<string, unknown>
> {
  protected plugin: string
  protected projectId: string
  protected agentId: string
  protected currentCredentials: PluginCredentialsType<T> | undefined

  constructor(agentId: string, plugin: string, projectId: string) {
    this.plugin = plugin
    this.projectId = projectId
    this.agentId = agentId
  }

  abstract init(): Promise<void>
  abstract update(): Promise<void>
  abstract getCredentials(): PluginCredentialsType<T> | undefined
  abstract getCredential(name: keyof T): T[keyof T] | undefined
  abstract getCustomCredential(name: string): Promise<string | undefined>
  abstract validateCredentials(credentials: T): Promise<boolean>
  abstract getRequiredCredentials(): (keyof T)[]
}
