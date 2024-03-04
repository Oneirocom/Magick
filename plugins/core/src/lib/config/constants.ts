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
  GET_SECRET: 'getSecret',
  GET_STATE: 'getState',
  UPLOAD_FILE: 'uploadFile',
  DOWNLOAD_FILE: 'downloadFile',
} as const

export const coreRemovedNodes = ['variable/get', 'variable/set', 'time/delay']
