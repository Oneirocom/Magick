import { Prisma } from '@magickml/server-db'

export type Credential = Prisma.$credentialsPayload['scalars']

export type AgentCredentialV2 = Prisma.$agent_credentialsPayload['scalars'] & {
  credential: Partial<Credential>
}

export type CredentialsWithValue = Credential & { value: string }

export type AgentCredential = Prisma.$agent_credentialsPayload['scalars']

export type CredentialKeyValuePair = {
  name: string
  value: string
  serviceType: string
}
export interface ICredentialManager {
  /**
   * Initialize the credential manager.
   */
  init(): Promise<void>

  /**
   * Update the current credentials from the data source.
   */
  refreshCredentialsCache(): Promise<void>

  /**
   * Get all current credentials.
   */
  getCredentials(): Promise<CredentialKeyValuePair[]>

  /**
   * Get a specific credential by name.
   * @param name The name of the credential to retrieve.
   */
  getCredential(name: string): string | undefined

  /**
   * Get a custom credential by name.
   * @param name The name of the custom credential to retrieve.
   */
  getCustomCredential(name: string): Promise<string | undefined>

  /**
   * Add or update a credential.
   * @param credential The credential to add or update.
   */
  addCredential(credential: Credential): Promise<{ id: string }>

  /**
   * Update a specific credential.
   * @param credential The credential to update.
   */
  updateCredential(credential: Credential): Promise<boolean>

  /**
   * Delete a specific credential.
   * @param name The name of the credential to delete.
   */
  deleteCredential(name: string): Promise<boolean>

  /**
   * Validate a specific credential.
   * @param name The name of the credential to validate.
   */
  validateCredential(name: string): Promise<boolean>
}
