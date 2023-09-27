import { ClientPlugin } from 'shared/core'
import { getNodes } from '@magickml/plugin-intent-shared'
import MediationIcon from '@mui/icons-material/Mediation'
import IntentWindow from './windows/IntentWindow'

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
          icon: MediationIcon,
          text: 'Intents',
          tooltip: 'Create and manage intent stories for intent detection.',
        },
      ],
      clientRoutes: [
        {
          path: '/intents',
          component: IntentWindow,
          plugin: 'IntentPlugin',
        },
      ],
    })
  }
}

export default new TaskIntentPluginPlugin()
