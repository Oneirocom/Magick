import { modelProviderMap } from './constants/modelProviderMap'
import { AllModels } from './types/models'
import { LLMProviderKeys, LLMProviders } from './types/providerTypes'

export function findProviderKey(model: AllModels): LLMProviderKeys | undefined {
  // console.log('MODEL', {
  //   model,
  //   providerMap: modelProviderMap[model],
  //   apikeyName: modelProviderMap[model].apiKeyName,
  // })

  return modelProviderMap[model].apiKeyName
}

export function findProviderName(model: AllModels): LLMProviders | undefined {
  return modelProviderMap[model].provider
}
