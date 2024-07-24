import { Agent } from '../../Agent'
import { CredentialManager } from './credentialsManager'
import { AgentConfigBuilder } from '../../core/AgentConfigBuilder'
import { TYPES } from '../../dependencies/dependency.config'

const WORLD_ID = '7294d268-6e8e-41be-a179-fd3f7650f9b0'
const AGENT_ID = '623ed862-251a-4c5a-8ba6-773bcf547b01'

describe.skip('CredentialManager Integration', () => {
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

    agent = new Agent('test-agent', config)
    await agent.initialize()
    credentialManager = agent.container.get(TYPES.CredentialManager)
  })

  afterAll(async () => {
    // Clean up resources if necessary
  })

  describe('addCredential', () => {
    it('should add a new credential and refresh the cache', async () => {
      const mockCredential = {
        name: 'test',
        value: 'test-value',
        serviceType: 'core',
        credentialType: 'custom',
        description: 'test-description',
        id: 'test-id',
        projectId: WORLD_ID,
        worldId: WORLD_ID,
        metadata: {},
        pluginName: '',
        created_at: new Date(),
        updated_at: new Date(),
      }

      const result = await credentialManager.addCredential(mockCredential)

      expect(result).toHaveProperty('id')
    })
  })

  describe('init', () => {
    it('should initialize and refresh credentials cache', async () => {
      expect(await credentialManager.init())
      expect(await credentialManager.getCredentials()).toBeGreaterThanOrEqual(0)
    })
  })

  describe('getCredentials', () => {
    it('should return cached credentials if available', async () => {
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

  describe('getCustomCredential', () => {
    it('should return the decrypted custom credential value by name', async () => {
      const value = await credentialManager.getCustomCredential('custom-test')

      if (value) {
        expect(value).toBe('test-value')
      } else {
        expect(value).toBeUndefined()
      }
    })

    it('should return undefined if custom credential is not found', async () => {
      const value = await credentialManager.getCustomCredential(
        'non-existing-credential'
      )

      expect(value).toBeUndefined()
    })
  })

  describe('updateCredential', () => {
    it('should update an existing credential and refresh the cache', async () => {
      const mockCredential = {
        name: 'test',
        value: 'new-test-value',
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

  describe('deleteCredential', () => {
    it('should delete an existing credential and refresh the cache', async () => {
      const result = await credentialManager.deleteCredential('test')

      expect(result).toBe(true)
      expect(await credentialManager.validateCredential('test')).toBe(false)
    })

    it('should throw an error if credential does not exist', async () => {
      await expect(
        credentialManager.deleteCredential('non-existing-credential')
      ).rejects.toThrow(
        'Error deleting credential non-existing-credential for agent: test-agent-id:'
      )
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
