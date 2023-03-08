import { eventSocket, ServerPlugin } from '@magickml/engine'

type StartLoopArgs = {
  spellHandler: any
  agent: any
  agentManager: any
}

class LoopManager {
  agentManager: any
  constructor(agentManager) {
    this.agentManager = agentManager
    this.agentManager.registerAddAgentHandler(({agent}) => this.addAgent({ agent }))
    this.agentManager.registerRemoveAgentHandler(({agent}) => this.removeAgent({ agent }))
  } 

  addAgent({ agent }) {
    if(!agent.data) return console.log("No data for this agent", agent.id)
    if(!agent.data.loop_enabled) return console.log("Loop is not enabled for this agent")
    const loopInterval = parseInt(agent.data.loop_interval) * 1000
    if (!loopInterval) {
      return console.error('Loop Interval must be a number greater than 0')
    }
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
    console.log('Added agent to loop', agent.id)
  }

  removeAgent({ agent }) {
    const _agent = this.agentManager.getAgent({ agent })
    if(!_agent || !_agent.loopHandler) return
    clearInterval(_agent.loopHandler)
  }
}


function getAgentMethods() {
  let loopManager: LoopManager | null = null;
  return {
    start: async ({ spellHandler, agent, agentManager }: StartLoopArgs) => {
      if(!loopManager) loopManager = new LoopManager(agentManager)
      agent.data.spellHandler = spellHandler
      loopManager.addAgent({ agent })
    },
    stop: async ({ agent }) => {
      if(!loopManager) return console.error('Loop Manager not initialized')
      loopManager.removeAgent({ agent })
    },
  }
}

const LoopPlugin = new ServerPlugin({
  name: 'LoopPlugin',
  agentMethods: getAgentMethods(),
  inputTypes: [{ name: 'Loop In', trigger: true, socket: eventSocket }],
})

export default LoopPlugin
