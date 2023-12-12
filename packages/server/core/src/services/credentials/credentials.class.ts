import type { Application } from '../../declarations'
import { CredentialsManager, CredentialsPayload } from 'server/credentials'

export class CredentialsService {
  static app: Application
  private credentialsManager: CredentialsManager

  constructor(app: Application) {
    CredentialsService.app = app
    this.credentialsManager = app.get(
      'credentialsManager'
    ) as CredentialsManager
  }

  async create(data: CredentialsPayload): Promise<{ id: string }> {
    console.log('Received data for credential creation:', data) // Debugging log

    const newCredentialId = await this.credentialsManager.storeCredentials(data)
    if (!newCredentialId) {
      throw new Error('Failed to store credentials')
    }
    return { id: newCredentialId }
  }

  async remove(id: string): Promise<{ id: string }> {
    const deletedId = await this.credentialsManager.deleteCredentials(id)
    return { id: deletedId }
  }
}

export const getOptions = (app: Application) => {
  return {
    name: 'credentials',
  }
}
