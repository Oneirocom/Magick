import { UserResponse } from '../userService/coreUserService'
import { SubscriptionNames } from '../userService/types'
import { AllModels } from './types/models'
import {
  LLMProviderKeys,
  LLMProviders,
  ProviderRecord,
} from './types/providerTypes'
import { availableProviders, providers } from './types/providers'

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

export function filterProvidersBasedOnSubscription({
  userData,
  providersWithKeys,
}: {
  userData: UserResponse
  providersWithKeys: LLMProviders[]
}): LLMProviders[] | undefined {
  let filteredProviders

  if (userData && userData.user) {
    if (userData.user.hasSubscription) {
      const userSubscriptionName = userData.user.subscriptionName?.trim()

      if (userSubscriptionName === SubscriptionNames.Wizard) {
        filteredProviders = availableProviders
      } else if (userSubscriptionName === SubscriptionNames.Apprentice) {
        filteredProviders = availableProviders.filter(provider =>
          providersWithKeys.includes(provider.provider)
        )
      }
    } else {
      if (userData.user.balance > 0) {
        filteredProviders = availableProviders
      }
    }
  }

  return filteredProviders.length > 0
    ? filteredProviders.map(prov => prov.provider)
    : undefined
}
