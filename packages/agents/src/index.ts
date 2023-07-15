import { AgentCommander } from './lib/AgentCommander'
import { BullQueue, app } from '@magickml/server-core'

export const agentCommander = new AgentCommander({
    pubSub: app.get('pubsub'),
    messageQueue: new BullQueue()
})

export * from './lib/Agent'
export * from './lib/AgentManager'
