import { PluginCredential } from 'server/credentials'

export const corePluginName = 'Core'

export const corePluginCredentials: PluginCredential[] = [
  {
    name: 'OPENAI_API_KEY',
    serviceType: 'openai',
    credentialType: 'plugin',
    clientName: 'OpenAI',
    initials: 'OA',
    description: 'OpenAI API Key',
    icon: 'https://openai.com/favicon.ico',
    helpLink: 'https://platform.openai.com/api-keys',
  },
]

export const CORE_DEP_KEYS = {
  ACTION_SERVICE: 'coreActionService',
  I_VARIABLE_SERVICE: 'IVariableService',
  LLM_SERVICE: 'coreLLMService',
  BUDGET_MANAGER_SERVICE: 'coreBudgetManagerService',
  MEMORY_SERVICE: 'coreMemoryService',
  IMAGE_SERVICE: 'coreImageService',
  LOGGER: 'ILogger',
}

// These nodes are removed from the core plugin because we have others that
// do the same thing but are more specific. For example, the variable/get
// node is removed because we have our own nodes that do
// the same thing but  more specific.
export const coreRemovedNodes = ['variable/get', 'variable/set']
