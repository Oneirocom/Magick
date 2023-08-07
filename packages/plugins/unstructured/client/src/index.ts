import { ClientPlugin } from '@magickml/core'
import MediationIcon from '@mui/icons-material/Mediation'

class TaskUnstructuredPluginPlugin extends ClientPlugin {
  /**
   * Constructs a new instance of the `TaskPlugin` class.
   */
  constructor() {
    super({
      name: 'UnstructuredPlugin',
      agentComponents: [],
      inputTypes: [],
      spellTemplates: [],
    })
  }
}

export default new TaskUnstructuredPluginPlugin()
