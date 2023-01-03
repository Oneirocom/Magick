import { roomManager } from './../../core/src/components/agents/roomManager'
import { getComponents, components } from '../../core/src/components'
import { initSharedEngine } from '../../core/src/engine'
import { Task } from '../../core/src/plugins/taskPlugin/task'
import SpellRunner from '../../core/src/spellManager/SpellRunner'
import { ThothComponent } from '../../core/src/thoth-component'

export { getComponents } from '../../core/src/components'
export { Task } from '../../core/src/plugins/taskPlugin/task'
export { initSharedEngine }
export { SpellRunner }
export { roomManager }

export * from '../../core/src/spellManager'
export * from '../../core/src/utils/chainHelpers'

export default {
  components,
  getComponents,
  initSharedEngine,
  Task,
  ThothComponent,
}
