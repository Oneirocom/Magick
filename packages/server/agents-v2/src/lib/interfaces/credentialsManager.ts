import { ExtensibleLanguageModel } from '@magickml/llm-service-types'
import { Model, UserResponse } from '@magickml/shared-services'

export enum PortalSubscriptions {
  NEOPHYTE = 'NEOPHYTE',
  APPRENTICE = 'APPRENTICE',
  WIZARD = 'WIZARD',
}

interface Credentials {
  apiKey: string
  apiSecret?: string
  [key: string]: any
}

export interface ICredentialManager {
  getCredentials(userId: string): Promise<Credentials>
  setCredentials(userId: string, credentials: Credentials): Promise<void>
  deleteCredentials(userId: string): Promise<void>
  validateCredentials(userId: string, providerId: string): Promise<boolean>
  getProvidersWithUserKeys(
    providerData: Record<
      string,
      { models: ExtensibleLanguageModel[]; apiKey: string }
    >,
    credentials: { name: string }[]
  ): Record<string, { models: ExtensibleLanguageModel[]; apiKey: string }>
  isModelAvailableToUser({
    userData,
    model,
    providersWithUserKeys,
  }: {
    userData: UserResponse
    model: Model
    providersWithUserKeys: Record<
      string,
      { models: ExtensibleLanguageModel[]; apiKey: string }
    >
  }): boolean
}
