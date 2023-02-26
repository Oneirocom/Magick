import { Plugin } from "@magickml/engine"
import { AgentLoopWindow } from "./components/loop.component"

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
    const loopInterval = parseInt(agent.data.loop_interval)
    if(!loopInterval) {
      return console.error('Loop Interval must be a number greater than 0');
    }
    this.agents.set(agent.projectId+'-'+agent.id, agent)
    agent.loopHandler = setInterval(async () => {
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
    this.agents.delete(agent.projectId+'-'+agent.id)
  }
  getAgent({ agent }) {
    return this.agents.get(agent.projectId+'-'+agent)
  }
}

const loopManager = new LoopManager()

function getAgentMethods() {
  return {
    start: async ({
      spellHandler,
      agent,
    }: StartLoopArgs) => {
      agent.spellHandler = spellHandler
      loopManager.addAgent({ agent })
    },
    stop: async ({
      agent
    }) => {
      loopManager.removeLoop({ agent })
    }
  }
}

const LoopPlugin = new Plugin({
  name: 'LoopPlugin', 
  nodes: [], 
  services: {},
  agentComponents: [AgentLoopWindow], 
  windowComponents: [],
  serverInit: null,
  serverRoutes: null,
  agentMethods: getAgentMethods(),
})

export default LoopPlugin;