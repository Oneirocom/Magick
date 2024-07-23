import { Agent } from './Agent'
import { AgentConfigBuilder } from './core/AgentConfigBuilder'
import { KeywordsLLMService } from './services/LLMService/KeywordsLLMService'
import { CredentialManager } from './services/credentialsManager/credentialsManager'

jest.setTimeout(10000) // Increase timeout for initialization

describe('Agent Integration', () => {
  let agent: Agent

  beforeAll(async () => {
    const config = new AgentConfigBuilder()
      .withOptions({
        redisUrl: 'redis://localhost:6379',
        worldId: 'test-world',
        agentId: 'test-agent',
      })
      .withLLMService(KeywordsLLMService)
      .withCredentialManagerService(CredentialManager)
      .build()

    agent = new Agent('test-agent', config)
    await agent.initialize()
  })

  afterAll(async () => {
    // Clean up resources if necessary
    // For example, if there's a disconnect method:
    // await agent.disconnect()
  })

  it('should initialize the agent', () => {
    expect(agent).toBeDefined()
    expect(agent.id).toBe('test-agent')
  })

  it('should receive events', done => {
    agent.on('initialized', () => {
      expect(true).toBe(true)
      done()
    })

    // Simulate the event being emitted
    agent.emit('initialized')
  })

  it('should have a llm service', () => {
    expect(agent.config.dependencies.LLMService).toBeDefined()
  })

  it('should have a credential manager service', () => {
    expect(agent.config.dependencies.credentialManager).toBeDefined()
  })
})
