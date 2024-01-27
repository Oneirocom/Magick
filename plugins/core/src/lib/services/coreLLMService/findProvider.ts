import { modelProviderMap } from './constants/modelProviderMap'
import { providerModelMap } from './constants/providerModelMap'
import { AllModels } from './types/models'
import { LLMProviderKeys, LLMProviders } from './types/providerTypes'

export function findProviderKey(model: AllModels): LLMProviderKeys | undefined {
  return modelProviderMap[model].apiKeyName
}

export function findProviderName(model: AllModels): LLMProviders | undefined {
  return modelProviderMap[model].provider
}

export function getModelsForProvider(
  provider: LLMProviders
): Partial<AllModels[] | undefined> {
  return providerModelMap[provider]
}

export function getProvidersWithUserKeys(
  keys: LLMProviderKeys[]
): LLMProviders[] {
  return keys
    .map(key => {
      const providerName = Object.keys(LLMProviderKeys).find(
        name => LLMProviderKeys[name] === key
      )
      return providerName
        ? (providerName.replace('_API_KEY', '') as LLMProviders)
        : undefined
    })
    .filter(provider => provider !== undefined) as LLMProviders[]
}
