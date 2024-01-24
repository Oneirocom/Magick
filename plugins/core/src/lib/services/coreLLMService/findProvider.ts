import { modelProviderMap } from './constants/modelProviderMap'
import { AllModels, LLMProviderKeys } from './types'

export function findProviderKey(model: AllModels): LLMProviderKeys | undefined {
  return LLMProviderKeys[modelProviderMap[model].apiKey]
}

export function findProviderName(
  model: AllModels
): LLMProviderKeys | undefined {
  return LLMProviderKeys[modelProviderMap[model].provider]
}
