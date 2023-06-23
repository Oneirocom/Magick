// DOCUMENTED
import { eventSocket, ServerPlugin, triggerSocket } from '@magickml/core'
import { app } from '@magickml/server-core'
type StartLoopArgs = {
  spellRunner: any
  agent: any
  agentManager: any
}

/**
 * Class to manage agent loops.
 */
class LoopManager {
  agentManager: any

  /**
   * Constructs a new LoopManager.
   * @param {any} agentManager - The agent manager to manage loops for.
   * @param {any} spellRunner - The spell runner used for executing agent loops.
   */
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

  /**
   * Adds an agent to the loop manager.
   * @param {any} spellRunner - The spell runner used for executing agent loops.
   * @param {any} agent - Agent to add.
   * @param {any} agentData - Data for the agent.
   */
  addAgent({ spellRunner, agent, agentData }) {
    if (!agentData) return console.log('No data for this agent', agent.id)
    if (!agentData.data?.loop_enabled)
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
            connector: 'Loop In',
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
        app,
      })
      console.log('output is', resp)
    }, loopInterval)
    agent.loopHandler = loopHandler
    console.log('Added agent to loop', agent.id)
  }

  /**
   * Removes an agent from the loop manager.
   * @param {any} agent - Agent to remove.
   */
  removeAgent({ agent }) {
    const _agent = this.agentManager.getAgent({ agent })
    if (!_agent || !agent.loopHandler) return
    clearInterval(agent.loopHandler)
    delete agent.loopHandler
  }
}

/**
 * Returns agent methods for starting and stopping loops.
 * @return {object} - The agent methods object.
 */
function getAgentMethods() {
  let loopManager: LoopManager | null = null
  return {
    start: async ({ spellRunner, agent, agentManager }: StartLoopArgs) => {
      if (!loopManager) loopManager = new LoopManager(agentManager, spellRunner)
      loopManager.addAgent({ spellRunner, agent, agentData: agent.data })
    },
    stop: async ({ agent }) => {
      if (!loopManager) return console.error('Loop Manager not initialized')
      loopManager.removeAgent({ agent })
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
