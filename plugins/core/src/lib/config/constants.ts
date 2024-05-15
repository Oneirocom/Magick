export const corePluginName = 'core' as const

export const CORE_DEP_KEYS = {
  ACTION_SERVICE: 'coreActionService',
  AGENT: 'agent',
  BUDGET_MANAGER_SERVICE: 'coreBudgetManagerService',
  DOWNLOAD_FILE: 'downloadFile',
  EVENT_STORE: 'IEventStore',
  GET_SECRET: 'getSecret',
  GET_STATE: 'getState',
  I_VARIABLE_SERVICE: 'IVariableService',
  IMAGE_SERVICE: 'coreImageService',
  LLM_SERVICE: 'coreLLMService',
  LOGGER: 'ILogger',
  MEMORY_SERVICE: 'coreMemoryService',
  MEMORY_STREAM_SERVICE: 'memoryStreamService',
  STATE_SERVICE: 'IStateService',
  UPLOAD_FILE: 'uploadFile',
} as const

export const coreRemovedNodes = ['variable/get', 'variable/set', 'time/delay']
