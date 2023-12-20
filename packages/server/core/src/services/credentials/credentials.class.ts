import type { Application } from '../../declarations'
import {
  AgentCredentialsPayload,
  CredentialsManager,
  CredentialsPayload,
} from 'server/credentials'
import type { Params } from '@feathersjs/feathers'

const getProjectId = (params: Params) => {
  return params?.query?.projectId as string
}

export class CredentialsService {
  static app: Application
  private credentialsManager: CredentialsManager

  constructor(app: Application) {
    CredentialsService.app = app
    this.credentialsManager = app.get(
      'credentialsManager'
    ) as CredentialsManager
  }

  // The following are project scoped
  async create(
    data: CredentialsPayload,
    params?: Params
  ): Promise<{ id: string }> {
    if (!data || !params) {
      throw new Error('Invalid credentials request')
    }

    const payload = {
      ...data,
      projectId: getProjectId(params),
    }

    const newCredentialId = await this.credentialsManager.storeCredentials(
      payload
    )
    if (!newCredentialId) {
      throw new Error('Failed to store credentials')
    }
    return { id: newCredentialId }
  }

  async remove(id: string): Promise<{ id: string }> {
    console.log('Received ID for removing credentials:', id)
    const deletedId = await this.credentialsManager.deleteCredentials(
      getProjectId({ query: { projectId: id } })
    )
    return { id: deletedId }
  }

  async find(params: any): Promise<Partial<CredentialsPayload>[]> {
    const x = await this.credentialsManager.listCredentials(
      getProjectId(params)
    )
    return x
  }

  // The following are agent scoped
  async linkCredentialToAgent(
    data: AgentCredentialsPayload,
    params?: Params
  ): Promise<void> {
    const { agentId, credentialId } = data
    await this.credentialsManager.linkCredentialToAgent({
      agentId,
      credentialId,
    })
  }

  async listAgentCredentials(
    data: { agentId: string; serviceType?: string },
    params?: Params
  ): Promise<AgentCredentialsPayload[]> {
    return await this.credentialsManager.listAgentCredentials(data.agentId)
  }

  async removeAgentCredential(
    data: { agentId: string; credentialId: string },
    params?: Params
  ): Promise<void> {
    const { agentId, credentialId } = data
    await this.credentialsManager.deleteAgentCredential(agentId, credentialId)
  }
}

export const getOptions = (app: Application) => {
  return {
    name: 'credentials',
  }
}
