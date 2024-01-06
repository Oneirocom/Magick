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

  async remove(id: string, params: Params): Promise<any> {
    return await this.credentialsManager.deleteCredentials(
      params?.query?.credentialId as string
    )
  }

  async find(params: any): Promise<Partial<CredentialsPayload>[]> {
    return await this.credentialsManager.listCredentials(getProjectId(params))
  }

  // The following are agent scoped
  async linkCredentialToAgent(data: AgentCredentialsPayload): Promise<void> {
    const { agentId, credentialId } = data
    await this.credentialsManager.linkCredentialToAgent({
      agentId,
      credentialId,
    })
  }

  async listAgentCredentials(data: {
    agentId: string
    serviceType?: string
  }): Promise<AgentCredentialsPayload[]> {
    return await this.credentialsManager.listAgentCredentials(data.agentId)
  }

  async removeAgentCredential(data: {
    agentId: string
    credentialId: string
  }): Promise<void> {
    const { agentId, credentialId } = data
    await this.credentialsManager.deleteAgentCredential(agentId, credentialId)
  }
}

export const getOptions = () => {
  return {
    name: 'credentials',
  }
}
