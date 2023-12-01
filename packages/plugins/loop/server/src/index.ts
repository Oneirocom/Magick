// DOCUMENTED
import {
  eventSocket,
  getLogger,
  ServerPlugin,
  triggerSocket,
} from 'shared/core'
import { app } from 'server/core'
import { LoopHandler } from './loopHandler'
import { Agent } from 'server/agents'
import pino from 'pino'
type StartLoopArgs = {
  agent: any
  agentManager: any
}

/**
 * Class to manage agent loops.
 */
class LoopManager {
  agentManager: any
  loopHandlers: Map<any, LoopHandler> // Store loop handlers
  logger: pino.Logger = getLogger()

  /**
   * Constructs a new LoopManager.
   * @param {any} agentManager - The agent manager to manage loops for.
   */
  constructor(agentManager) {
    this.logger.debug('Creating new LoopManager')
    this.agentManager = agentManager
    this.agentManager.registerAddAgentHandler(({ agent, agentData }) =>
      this.addAgent({ agent, agentData })
    )
    this.agentManager.registerRemoveAgentHandler(agent =>
      this.removeAgent(agent.id)
    )
    this.loopHandlers = new Map()
  }

  /**
   * Adds an agent to the loop manager.
   * @param {any} agent - Agent to add.
   * @param {any} agentData - Data for the agent.
   */
  addAgent({ agent, agentData }) {
    if (!agentData) return console.log('No data for this agent', agent.id)
    if (!agentData.data?.loop_enabled)
      return console.log('Loop is not enabled for this agent')

    const loopInterval = parseInt(agentData.data.loop_interval) * 1000
    if (!loopInterval) {
      return console.error('Loop Interval must be a number greater than 0')
    }

    const loopHandler = new LoopHandler(async () => {
      console.log('running loop handler')
      const resp = await app.get('agentCommander').runSpell({
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
        agentId: agent.id,
        spellId: agent.rootSpellId,
        secrets: agent.secrets,
        publicVariables: agent.publicVariables,
      })
      console.log('output is', resp)
    }, loopInterval)

    this.loopHandlers.set(agent.id, loopHandler)

    agent.loopHandler = loopHandler
    console.log('Added agent to loop', agent.id)
  }

  /**
   * Removes an agent from the loop manager.
   * @param {any} agent - Agent to remove.
   */
  removeAgent(agentId) {
    this.logger.debug(`Removing agent ${agentId} from loop manager`)
    const agent = this.agentManager.getAgent(agentId) as AgentWithLoop
    if (!agent || !agent.loopHandler) return
    const loopHandler = this.loopHandlers.get(agent.id)
    if (!loopHandler) return
    loopHandler.destroy()
    this.loopHandlers.delete(agent.id)
    // @ts-ignore
    delete agent?.loopHandler
  }

  startLoop(_, agentId) {
    const loopHandler = this.loopHandlers.get(agentId)
    if (loopHandler) {
      loopHandler.resume() // Assumes loopHandler has a resume method
    }
  }

  stopLoop(_, agentId) {
    const loopHandler = this.loopHandlers.get(agentId)
    if (loopHandler) {
      loopHandler.pause() // Assumes loopHandler has a pause method
    }
  }

  stepLoop(_, agentId) {
    const loopHandler = this.loopHandlers.get(agentId)
    if (loopHandler) {
      loopHandler.step() // Assumes loopHandler has a step method
    }
  }
}

/**
 * Returns agent methods for starting and stopping loops.
 * @return {object} - The agent methods object.
 */
function getAgentMethods() {
  let loopManager: LoopManager | null = null
  return {
    start: async ({ agent, agentManager }: StartLoopArgs) => {
      if (!loopManager) loopManager = new LoopManager(agentManager)
      loopManager.addAgent({ agent, agentData: agent.data })
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

type AgentWithLoop = Agent & {
  loopHandler: LoopHandler
}

const LoopPlugin = new ServerPlugin({
  name: 'LoopPlugin',
  agentMethods: getAgentMethods(),
  inputTypes: [{ name: 'Loop In', sockets: inputSockets }],
  agentCommands: {
    start: (data, agent) => {
      ;(agent as AgentWithLoop).log('starting loop')
      ;(agent as AgentWithLoop).loopHandler.resume()
    },
    stop: (data, agent) => {
      ;(agent as AgentWithLoop).log('stopping loop')
      ;(agent as AgentWithLoop).loopHandler.pause()
    },
    step: (data, agent) => {
      ;(agent as AgentWithLoop).log('stepping through loop')
      ;(agent as AgentWithLoop).loopHandler.step()
    },
  },
})

export default LoopPlugin
