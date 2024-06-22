import { AgentCommander } from './AgentCommander'

export const initAgentCommander = async (app: any) => {
  const agentCommander = new AgentCommander({
    pubSub: app.get('pubsub'),
  })

  app.set('agentCommander', agentCommander)
}
