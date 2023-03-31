import { eventSocket, ServerPlugin, triggerSocket } from '@magickml/engine'

type StartLoopArgs = {
  spellRunner: any
  agent: any
  agentManager: any
}

class LoopManager {
  agentManager: any
  loopHandlers = new Map<string, any>()
  constructor(agentManager, spellRunner) {
    console.log('new loop manager created')
    this.agentManager = agentManager
    this.agentManager.registerAddAgentHandler(({ agent, agentData }) =>
      this.addAgent({ spellRunner, agent, agentData })
    )
    this.agentManager.registerRemoveAgentHandler(({ agent }) =>
      this.removeAgent({ agent })
    )
  }

  addAgent({ spellRunner, agent, agentData }) {
    console.log('addAgent', agent.id)
    if (!agentData) return console.log('No data for this agent', agent.id)
    if (!agentData.data.loop_enabled)
      return console.log('Loop is not enabled for this agent')
    const loopInterval = parseInt(agentData.data.loop_interval) * 1000
    if (!loopInterval) {
      return console.error('Loop Interval must be a number greater than 0')
    }
    const loopHandler = setInterval(async () => {
      console.log('running loop handler')
      const resp = await spellRunner.runComponent({
        inputs: {
          'Input - Loop In': {
            content: 'loop',
            sender: 'loop',
            observer: agent.name,
            client: 'loop',
            channel: 'auto',
            channelType: 'loop',
            projectId: agent.projectId,
            entities: [],
          },
        },
        agent,
        secrets: agent.secrets,
        publicVariables: agent.publicVariables,
      })
      console.log('output is', resp)
    }, loopInterval)
    this.loopHandlers[agent.id] = loopHandler
    console.log('Added agent to loop', agent.id)
  }

  removeAgent({ agent }) {
    const _agent = this.agentManager.getAgent({ agent })
    if (!_agent || !this.loopHandlers.get(agent.id)) return
    clearInterval(this.loopHandlers.get(agent.id))
    this.loopHandlers.delete(agent.id)
  }
}

function getAgentMethods() {
  let loopManager: LoopManager | null = null
  return {
    start: async ({ spellRunner, agent, agentManager }: StartLoopArgs) => {
      if (!loopManager) loopManager = new LoopManager(agentManager, spellRunner)
      loopManager.addAgent({ spellRunner, agent, agentData: agent.data })
    },
    stop: async () => {
      if (!loopManager) return console.error('Loop Manager not initialized')
      return console.log('Stopping loop manager')
    },
  }
}

const inputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  },
  {
    socket: 'trigger',
    name: 'trigger',
    type: triggerSocket,
  },
]

const LoopPlugin = new ServerPlugin({
  name: 'LoopPlugin',
  agentMethods: getAgentMethods(),
  inputTypes: [{ name: 'Loop In', sockets: inputSockets }],
})

export default LoopPlugin
