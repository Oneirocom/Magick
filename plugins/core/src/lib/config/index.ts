import { EventTypes } from 'communication'
import { EventPayload } from 'server/plugin'

export const corePluginName = 'core' as const

export const CORE_DEP_KEYS = {
  ACTION_SERVICE: 'coreActionService',
  STATE_SERVICE: 'IStateService',
  EVENT_STORE: 'IEventStore',
  I_VARIABLE_SERVICE: 'IVariableService',
  LLM_SERVICE: 'coreLLMService',
  BUDGET_MANAGER_SERVICE: 'coreBudgetManagerService',
  MEMORY_SERVICE: 'coreMemoryService',
  IMAGE_SERVICE: 'coreImageService',
  LOGGER: 'ILogger',
}

export const coreRemovedNodes = ['variable/get', 'variable/set', 'time/delay']

export type CorePluginEvents = {
  [EventTypes.ON_MESSAGE]: (payload: EventPayload) => void
}

export * from './credentials'
export * from './state'
export * from './commands'
