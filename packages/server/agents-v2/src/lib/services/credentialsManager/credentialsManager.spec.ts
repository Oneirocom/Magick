import { Agent } from '../../Agent'
import { CredentialManager } from './credentialsManager'
import { AgentConfigBuilder } from '../../core/AgentConfigBuilder'
import { TYPES } from '../../dependencies/dependency.config'
import { encrypt } from '@magickml/credentials'
import { CREDENTIALS_ENCRYPTION_KEY } from '@magickml/server-config'

const WORLD_ID = '7294d268-6e8e-41be-a179-fd3f7650f9b0'
const AGENT_ID = '623ed862-251a-4c5a-8ba6-773bcf547b01'
const CREDENTIAL_ID = 'a75139d7-af86-4b1c-8b95-cd258a3debeb'

describe('CredentialManager Integration', () => {
  let credentialManager: CredentialManager
  let agent: Agent

  beforeAll(async () => {
    const config = new AgentConfigBuilder()
      .withOptions({
        redisUrl: 'redis://localhost:6379',
        worldId: WORLD_ID,
        agentId: AGENT_ID,
      })
      .withCredentialManagerService(CredentialManager)
      .build()

    agent = new Agent(AGENT_ID, config)
    await agent.initialize()
    credentialManager = agent.container.get(TYPES.CredentialManager)

    const mockCredential = {
      name: 'test',
      value: encrypt('test-value', CREDENTIALS_ENCRYPTION_KEY),
      serviceType: 'core',
      credentialType: 'custom',
      description: 'test-description',
      id: CREDENTIAL_ID,
      projectId: WORLD_ID,
      worldId: WORLD_ID,
      metadata: {},
      pluginName: '',
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await credentialManager.addCredential(mockCredential)

    console.log('Added credential:', result.id)
  })

  afterAll(async () => {
    const result = await credentialManager.deleteCredential('test')
    expect(result).toBe(true)
    console.log('Deleted credential:', result)
  })

  describe('getCredentials', () => {
    it('should return credentials if available', async () => {
      const credentials = await credentialManager.getCredentials()

      expect(credentials).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            value: expect.any(String),
            serviceType: 'core',
          }),
        ])
      )
    })
  })

  describe('updateCredential', () => {
    it('should update an existing credential and refresh the cache', async () => {
      const mockCredential = {
        name: 'test',
        value: encrypt('new-test-value', CREDENTIALS_ENCRYPTION_KEY),
        serviceType: 'core',
        credentialType: 'custom',
        description: 'updated-description',
      }

      const result = await credentialManager.updateCredential(mockCredential)

      expect(result).toBe(true)
    })

    it('should throw an error if credential does not exist', async () => {
      const mockCredential = {
        name: 'non-existing-credential',
        value: 'new-test-value',
        serviceType: 'core',
        credentialType: 'custom',
        description: 'updated-description',
      }

      await expect(
        credentialManager.updateCredential(mockCredential)
      ).rejects.toThrow(`Credential ${mockCredential.name} not found`)
    })
  })

  describe('validateCredential', () => {
    it('should return true if the credential exists and is valid', async () => {
      const result = await credentialManager.validateCredential('test')

      expect(result).toBe(true)
    })

    it('should return false if the credential does not exist', async () => {
      const result = await credentialManager.validateCredential(
        'non-existing-credential'
      )

      expect(result).toBe(false)
    })
  })
})
