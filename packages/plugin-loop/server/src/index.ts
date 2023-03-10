import { eventSocket, ServerPlugin } from '@magickml/engine'

type StartLoopArgs = {
  spellRunner: any
  agent: any
  agentManager: any
}

class LoopManager {
  agentManager: any
  loopHandlers = new Map<string, any>();
  spellRunner: any
  constructor(agentManager, spellRunner) {
    this.spellRunner = spellRunner
    this.agentManager = agentManager
    this.agentManager.registerAddAgentHandler(({agent, agentData}) => this.addAgent({ agent, agentData }))
    this.agentManager.registerRemoveAgentHandler(({agent}) => this.removeAgent({ agent }))
  } 

  addAgent({ agent, agentData }) {
    console.log('addAgent', agent)
    if(!agentData) return console.log("No data for this agent", agent.id)
    if(!agentData.data.loop_enabled) return console.log("Loop is not enabled for this agent")
    const loopInterval = parseInt(agentData.data.loop_interval) * 1000
    if (!loopInterval) {
      return console.error('Loop Interval must be a number greater than 0')
    }
    const loopHandler = setInterval(async () => {
      const resp = await this.spellRunner({
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
    this.loopHandlers[agent.id] = loopHandler
    console.log('Added agent to loop', agent.id)
  }

  removeAgent({ agent }) {
    const _agent = this.agentManager.getAgent({ agent })
    if(!_agent || !this.loopHandlers.get(agent.id)) return
    clearInterval(this.loopHandlers.get(agent.id))
    this.loopHandlers.delete(agent.id)
  }
}


function getAgentMethods() {
  let loopManager: LoopManager | null = null;
  return {
    start: async ({ spellRunner, agentManager }: StartLoopArgs) => {
      if(!loopManager) loopManager = new LoopManager(agentManager, spellRunner)
    },
    stop: async () => {
      if(!loopManager) return console.error('Loop Manager not initialized')
      return console.log('Stopping loop manager')
    },
  }
}

const LoopPlugin = new ServerPlugin({
  name: 'LoopPlugin',
  agentMethods: getAgentMethods(),
  inputTypes: [{ name: 'Loop In', trigger: true, socket: eventSocket }],
})

export default LoopPlugin
