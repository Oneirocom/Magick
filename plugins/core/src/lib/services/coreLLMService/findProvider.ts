import { UserResponse } from '../userService/coreUserService'
import { SubscriptionNames } from '../userService/types'
import { AllModels } from './types/models'
import {
  LLMProviderKeys,
  LLMProviders,
  ProviderRecord,
} from './types/providerTypes'
import { providers } from './types/providers'

export function findProvider(model: AllModels): ProviderRecord | undefined {
  for (const providerKey in providers) {
    const provider = providers[providerKey]
    if (provider.allModels.includes(model)) {
      return provider
    }
  }
  return undefined
}

export function getProvidersWithUserKeys(
  keys: LLMProviderKeys[]
): LLMProviders[] {
  const provider = Object.values(providers)
    .filter(provider => keys.includes(provider.keyName))
    .map(provider => provider.provider)
  return provider
}

export function isModelAvailableToUser({
  userData,
  model,
  modelsWithKeys,
}: {
  userData: UserResponse
  model: AllModels
  modelsWithKeys: AllModels[]
}): boolean {
  if (userData && userData.user) {
    if (userData.user.hasSubscription) {
      const userSubscriptionName = userData.user.subscriptionName?.trim()

      if (userSubscriptionName === SubscriptionNames.Wizard) {
        // All models are available for Wizard subscription
        return true
      }
      if (userSubscriptionName === SubscriptionNames.Apprentice) {
        // Only models with keys are available for Apprentice subscription
        const hasBalance = userData.user.balance > 0
        return hasBalance ? true : modelsWithKeys.includes(model)
      }
    } else {
      if (userData.user.balance > 0) {
        // All models are available if user has a positive balance
        return true
      }
    }
  }
  // If no subscription and no balance, model is not available
  return false
}
