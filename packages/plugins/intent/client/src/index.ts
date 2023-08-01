import { ClientPlugin } from '@magickml/core'
import { getNodes } from '@magickml/plugin-intent-shared'

const IntentPlugin = new ClientPlugin({
  name: 'IntentPlugin',
  nodes: getNodes(),
})

class TaskIntentPluginPlugin extends ClientPlugin {
  /**
   * Constructs a new instance of the `TaskPlugin` class.
   */
  constructor() {
    super({
      name: 'IntentPlugin',
      agentComponents: [],
      inputTypes: [],
      spellTemplates: [],
      nodes: getNodes(),
      drawerItems: [
        {
          path: '/intents',
          icon: AssignmentTurnedInIcon,
          text: 'Tasks',
          tooltip: 'Objectives for agents to iterate through and complete',
        },
      ],
      clientRoutes: [
        {
          path: '/intents',
          component: TaskWindow,
          plugin: 'TaskPlugin',
        },
      ],
    })
  }
}

export default new TaskPlugin()
