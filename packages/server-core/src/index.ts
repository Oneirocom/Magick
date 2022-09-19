import {
  getComponents,
  components,
} from '@thothai/core/src/components/components'
import { initSharedEngine } from '@thothai/core/src/engine'
import { Task } from '@thothai/core/src/plugins/taskPlugin/task'
import SpellRunner from '@thothai/core/src/spellManager/SpellRunner'
import { ThothComponent } from '@thothai/core/src/thoth-component'

export { getComponents } from '@thothai/core/src/components/components'
export { Task } from '@thothai/core/src/plugins/taskPlugin/task'
export { initSharedEngine }
export { SpellRunner }

export * from '@thothai/core/src/spellManager'
export * from '@thothai/core/src/utils/chainHelpers'

export default {
  components,
  getComponents,
  initSharedEngine,
  Task,
  ThothComponent,
}
