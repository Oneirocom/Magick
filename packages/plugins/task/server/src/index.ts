// DOCUMENTED
import { eventSocket, ServerPlugin, triggerSocket } from 'shared/core'
import { app } from 'server/core'
import { getNodes } from '@magickml/plugin-task-shared'

type StartTaskArgs = {
  agent: any
  agentManager: any
}

/**
 * Class to manage agent tasks.
 */
class TaskManager {
  agentManager: any

  /**
   * Constructs a new TaskManager.
   * @param {any} agentManager - The agent manager to manage tasks for.
   */
  constructor(agentManager) {
    console.log('new task manager created')
    this.agentManager = agentManager
    this.agentManager.registerAddAgentHandler(({ agent, agentData }) =>
      this.addAgent({ agent, agentData })
    )
    this.agentManager.registerRemoveAgentHandler(({ agent }) =>
      this.removeAgent({ agent })
    )
  }

  /**
   * Adds an agent to the task manager.
   * @param {any} agent - Agent to add.
   * @param {any} agentData - Data for the agent.
   */
  addAgent({ agent, agentData }) {
    if (!agentData) return console.log('No data for this agent', agent.id)
    if (!agentData.data?.task_enabled)
      return console.log('Task is not enabled for this agent')
    const taskHandler = async () => {
      // Don't run this function if it has been deleted
      if (!agent?.taskHandler) return console.log('No task handler')

      // get all tasks for this agent
      const tasks = await app.service('tasks').find({
        query: {
          agentId: agent.id,
          projectId: agent.projectId,
          status: 'active',
        },
      })

      const taskArray = tasks.data || []

      // we dont want to blast the database, so run on a 1 second loop when tasks are empty
      if (taskArray.length === 0) {
        setTimeout(async () => agent?.taskHandler && agent.taskHandler(), 1000)
        return
      }

      // iterate over all tasks
      for (const task of taskArray) {
        console.log('Running task', task.id, task)
        const resp = await app.get('agentCommander').runSpell({
          inputs: {
            'Input - Task': task,
          },
          agent,
          agentId: agent.id,
          spellId: agent.rootSpellId,
          secrets: agent.secrets,
          publicVariables: agent.publicVariables,
        })
        console.log('output is', resp)
      }
      console.log('Finished task handler, calling next frame')

      setTimeout(async () => agent?.taskHandler && agent?.taskHandler(), 1000)
    }
    agent.taskHandler = taskHandler
    // start the taskHandler
    agent.taskHandler()
  }

  /**
   * Removes an agent from the task manager.
   * @param {any} agent - Agent to remove.
   */
  removeAgent({ agent }) {
    const _agent = this.agentManager.getAgent(agent.id)
    if (!_agent || !agent?.taskHandler) return
    clearInterval(agent.taskHandler)
    delete agent.taskHandler
  }
}

/**
 * Returns agent methods for starting and stopping tasks.
 * @return {object} - The agent methods object.
 */
function getAgentMethods() {
  let taskManager: TaskManager | null = null
  return {
    start: async ({ agent, agentManager }: StartTaskArgs) => {
      if (!taskManager) taskManager = new TaskManager(agentManager)
      taskManager.addAgent({ agent, agentData: agent.data })
    },
    stop: async ({ agent }) => {
      if (!taskManager) return console.error('Task Manager not initialized')
      taskManager.removeAgent({ agent })
      return console.log('Stopping task manager')
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

const TaskPlugin = new ServerPlugin({
  name: 'TaskPlugin',
  agentMethods: getAgentMethods(),
  inputTypes: [{ name: 'Task', sockets: inputSockets }],
  nodes: getNodes(),
})

export default TaskPlugin
