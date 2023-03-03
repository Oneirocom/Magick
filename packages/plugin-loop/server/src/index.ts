import { eventSocket, ServerPlugin } from '@magickml/engine'

type StartLoopArgs = {
  spellHandler: any
  agent: any
}

class LoopManager {
  agents: Map<string, any> = new Map()
  constructor() {
    this.agents = new Map()
  }
  addAgent({ agent }) {
    const loopInterval = parseInt(agent.data.loop_interval) * 1000
    if (!loopInterval) {
      return console.error('Loop Interval must be a number greater than 0')
    }
    this.agents.set(agent.projectId + '-' + agent.id, agent)
    agent.loopHandler = setInterval(async () => {
      console.log('running loop')
      const resp = await agent.spellHandler({
        content: 'loop',
        sender: 'loop',
        observer: agent.name,
        client: 'loop',
        channel: 'auto',
        channelType: 'loop',
        projectId: agent.projectId,
        entities: [],
      })
    }, loopInterval)
  }
  removeLoop({ agent }) {
    const _agent = this.getAgent({ agent })
    clearInterval(_agent.loopHandler)
    this.agents.delete(agent.projectId + '-' + agent.id)
  }
  getAgent({ agent }) {
    return this.agents.get(agent.projectId + '-' + agent)
  }
}

const loopManager = new LoopManager()

function getAgentMethods() {
  return {
    start: async ({ spellHandler, agent }: StartLoopArgs) => {
      agent.spellHandler = spellHandler
      loopManager.addAgent({ agent })
    },
    stop: async ({ agent }) => {
      loopManager.removeLoop({ agent })
    },
  }
}

const LoopPlugin = new ServerPlugin({
  name: 'LoopPlugin',
  agentMethods: getAgentMethods(),
  inputTypes: [{ name: 'Loop In', trigger: true, socket: eventSocket }],
})

export default LoopPlugin
