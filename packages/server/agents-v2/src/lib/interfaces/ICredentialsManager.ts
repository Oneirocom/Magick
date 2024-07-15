import { PluginCredential } from '@magickml/credentials'
import { CredentialsType } from '../services/credentialsManager/credentialsManager'

export type CredentialType = 'core' | 'plugin' | 'custom'
export interface ICredentialManager<
  T extends object = Record<string, unknown>
> {
  /**
   * Initialize the credential manager.
   */
  init(): Promise<void>

  /**
   * Update the current credentials from the data source.
   */
  update(): Promise<void>

  /**
   * Get all current credentials.
   */
  getCredentials(): CredentialsType<T> | undefined

  /**
   * Get a specific credential by name.
   * @param name The name of the credential to retrieve.
   */
  getCredential(name: keyof T): T[keyof T] | undefined

  /**
   * Get a custom credential by name.
   * @param name The name of the custom credential to retrieve.
   */
  getCustomCredential(name: string): Promise<string | undefined>

  /**
   * Add or update a credential.
   * @param credential The credential to add or update.
   */
  addCredential(
    credential: Partial<T>,
    pluginCredential: PluginCredential
  ): Promise<void>

  /**
   * Delete a specific credential.
   * @param name The name of the credential to delete.
   */
  deleteCredential(name: keyof T): Promise<void>

  /**
   * Validate a specific credential.
   * @param name The name of the credential to validate.
   */
  validateCredential(name: keyof T): Promise<boolean>

  /**
   * Get a list of required credentials.
   */
  getRequiredCredentials(): (keyof T)[]
}
