// DOCUMENTED
import { ClientPlugin, eventSocket, triggerSocket } from 'shared/core'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import { AgentTaskWindow } from './components/task.component'
import TaskWindow from './windows/TaskWindow'
import { getNodes } from '@magickml/plugin-task-shared'
/**
 * The sockets that the `TaskPlugin` accepts as input.
 */
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

/**
 * The `TaskPlugin` class provides task functionality to the engine.
 */
class TaskPlugin extends ClientPlugin {
  /**
   * Constructs a new instance of the `TaskPlugin` class.
   */
  constructor() {
    super({
      name: 'TaskPlugin',
      agentComponents: [AgentTaskWindow],
      inputTypes: [{ name: 'Task', sockets: inputSockets }],
      spellTemplates: [],
      nodes: getNodes(),
      drawerItems: [
        {
          path: '/tasks',
          icon: AssignmentTurnedInIcon,
          text: 'Tasks',
          tooltip: 'Objectives for agents to iterate through and complete',
        },
      ],
      clientRoutes: [
        {
          path: '/tasks',
          component: TaskWindow,
          plugin: 'TaskPlugin',
        },
      ],
    })
  }
}

export default new TaskPlugin()
