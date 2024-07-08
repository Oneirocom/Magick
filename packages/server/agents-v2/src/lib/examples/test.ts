import { Agent } from '../Agent'
import { AgentConfigBuilder } from '../core/agentConfigBuilder'

async function createAgent(id: string): Promise<Agent> {
  const config = new AgentConfigBuilder()
    // .withDatabase(() => new StateService())
    .withOptions({
      redisUrl: 'redis://localhost:6379',
    })
    .build()

  const agent = new Agent(id, config)

  await agent.initialize()

  return agent
}

createAgent('agent-1').then(agent => {
  agent.on('pluginInitialized', () => {
    console.log('Test event received')
  })
})
