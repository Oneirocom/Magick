import { PortalSubscriptions } from '@magickml/portal-utils-shared'
import { UserResponse } from '../userService/types'
import { PortalSubscriptions } from '@magickml/portal-utils-shared'
import { UserResponse } from '../userService/types'
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

export function removeFirstVendorTag(modelName) {
  // Define a regex pattern to match the first vendor tag
  const prefixPattern = /^([^/]+\/)?(.+)$/

  // Use regex to extract the model name without the first vendor tag
  const match = modelName.match(prefixPattern)
  if (match && match.length === 3) {
    return match[2] // The second capture group is the model name without the first vendor tag
  }
  // If no tag is found, return the original model name
  return modelName
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

      if (userSubscriptionName === PortalSubscriptions.NEOPHYTE) {
        // Only models with keys are available for Journeyman subscription
        if (
          userData?.user?.balance > 0 ||
          userData?.user?.promoCredit > 0 ||
          userData?.user?.introCredit > 0
        ) {
          // All models are available if user has a positive balance
          return true
        }
      }
      if (userSubscriptionName === PortalSubscriptions.APPRENTICE) {
        // Only models with keys are available for Apprentice subscription
        const hasBalance = userData.user.balance > 0
        return hasBalance ? true : modelsWithKeys.includes(model)
      }
      if (userSubscriptionName === PortalSubscriptions.WIZARD) {
        // All models are available for Wizard subscription
        return true
      }
    } else {
      return false
    }
  }
  // If no subscription and no balance, model is not available
  return false
}
