// DOCUMENTED 
import { eventSocket, ServerPlugin, triggerSocket } from '@magickml/core';
import { app } from '@magickml/server-core';
import { getNodes } from '@magickml/plugin-task-shared'

type StartTaskArgs = {
  spellRunner: any;
  agent: any;
  agentManager: any;
};

/**
 * Class to manage agent tasks.
 */
class TaskManager {
  agentManager: any;

  /**
   * Constructs a new TaskManager.
   * @param {any} agentManager - The agent manager to manage tasks for.
   * @param {any} spellRunner - The spell runner used for executing agent tasks.
   */
  constructor(agentManager, spellRunner) {
    console.log('new task manager created');
    this.agentManager = agentManager;
    this.agentManager.registerAddAgentHandler(({ agent, agentData }) =>
      this.addAgent({ spellRunner, agent, agentData })
    );
    this.agentManager.registerRemoveAgentHandler(({ agent }) =>
      this.removeAgent({ agent })
    );
  }

  /**
   * Adds an agent to the task manager.
   * @param {any} spellRunner - The spell runner used for executing agent tasks.
   * @param {any} agent - Agent to add.
   * @param {any} agentData - Data for the agent.
   */
  addAgent({ spellRunner, agent, agentData }) {
    if (!agentData) return console.log('No data for this agent', agent.id);
    if (!agentData.data.task_enabled)
      return console.log('Task is not enabled for this agent');
    const taskInterval = parseInt(agentData.data.task_interval) * 1000;
    if (!taskInterval) {
      return console.error('Task Interval must be a number greater than 0');
    }
    const taskHandler = setInterval(async () => {
      console.log('running task handler');
      const resp = await spellRunner.runComponent({
        inputs: {
          'Input - Task In': {
            content: 'task',
            sender: 'task',
            observer: agent.name,
            client: 'task',
            channel: 'auto',
            channelType: 'task',
            projectId: agent.projectId,
            entities: [],
          },
        },
        agent,
        secrets: agent.secrets,
        publicVariables: agent.publicVariables,
        app
      });
      console.log('output is', resp);
    }, taskInterval);
    agent.taskHandler = taskHandler;
    console.log('Added agent to task', agent.id);
  }

  /**
   * Removes an agent from the task manager.
   * @param {any} agent - Agent to remove.
   */
  removeAgent({ agent }) {
    const _agent = this.agentManager.getAgent({ agent });
    if (!_agent || !agent.taskHandler) return;
    clearInterval(agent.taskHandler);
    delete agent.taskHandler;
  }
}

/**
 * Returns agent methods for starting and stopping tasks.
 * @return {object} - The agent methods object.
 */
function getAgentMethods() {
  let taskManager: TaskManager | null = null;
  return {
    start: async ({ spellRunner, agent, agentManager }: StartTaskArgs) => {
      if (!taskManager) taskManager = new TaskManager(agentManager, spellRunner);
      taskManager.addAgent({ spellRunner, agent, agentData: agent.data });
    },
    stop: async ({agent}) => {
      if (!taskManager) return console.error('Task Manager not initialized');
      taskManager.removeAgent({ agent });
      return console.log('Stopping task manager');
    },
  };
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
];

const TaskPlugin = new ServerPlugin({
  name: 'TaskPlugin',
  agentMethods: getAgentMethods(),
  inputTypes: [{ name: 'Task In', sockets: inputSockets }],
  nodes: getNodes()
});

export default TaskPlugin;