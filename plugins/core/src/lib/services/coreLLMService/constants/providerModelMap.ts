import { AllModels } from '../types/models'
import { LLMProviders } from '../types/providerTypes'
import { modelProviderMap } from './modelProviderMap'

type ProviderModelMapping = {
  [provider in LLMProviders]?: AllModels[]
}

export const providerModelMap: ProviderModelMapping = {}

// Iterate over each model in modelProviderMap
Object.entries(modelProviderMap).forEach(([model, providerMapping]) => {
  const provider = providerMapping.provider

  // Initialize an array for the provider if it doesn't exist
  if (!providerModelMap[provider]) {
    providerModelMap[provider] = []
  }

  // Add the model to the provider's array
  providerModelMap[provider]?.push(model as AllModels)
})
