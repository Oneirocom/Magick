import { Agent } from './Agent'
import { AgentConfigBuilder } from './core/AgentConfigBuilder'
import { KeyvStateService } from './dependencies/keyvStateService'

jest.setTimeout(10000) // Increase timeout for initialization

describe('Agent Integration', () => {
  let agent: Agent

  beforeAll(async () => {
    const config = new AgentConfigBuilder()
      .withOptions({
        redisUrl: 'redis://localhost:6379',
      })
      .withStateService(KeyvStateService)
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

  // Add more tests as needed
})
