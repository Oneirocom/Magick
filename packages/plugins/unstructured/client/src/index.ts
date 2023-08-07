import { ClientPlugin } from '@magickml/core'
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
    })
  }
}

export default new TaskIntentPluginPlugin()
