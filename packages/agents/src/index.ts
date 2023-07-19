import { BullQueue } from '@magickml/server-core';
import { app } from '@magickml/server-core';
import { AgentCommander } from './lib/AgentCommander';

export * from './lib/Agent'
export * from './lib/AgentManager'
export * from './lib/AgentCommander'

export const initAgentCommander = async () => {
    const agentCommander = new AgentCommander({
        pubSub: app.get('pubsub'),
        messageQueue: new BullQueue()
    })

    app.set('agentCommander', agentCommander)
}
