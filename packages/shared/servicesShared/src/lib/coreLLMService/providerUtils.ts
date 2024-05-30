import { PortalSubscriptions } from '@magickml/portal-utils-shared'
import { UserResponse } from '../userService/types'
import { Model } from './types/models'

export const legacyProviderIdMapping = {
  openai: 'openai',
  azure_openai: 'azure_openai',
  azure_openai_vision: 'azure_openai_vision',
  anthropic: 'anthropic',
  perplexity: 'perplexity',
  cohere: 'cohere',
  togetherai: 'togetherai',
  openrouter: 'openrouter',
  together: 'togetherai',
  mistralai: 'mistral',
  mistral: 'mistral',
  palm: 'google_palm',
  google: 'google_palm',
  google_palm: 'google_palm',
  vertexai: 'google_vertex_ai',
  google_vertex_ai: 'google_vertex_ai',
  google_gemini_ai: 'google_gemini_ai',
  groq: 'groq',
  fireworks: 'fireworks',
  aws_bedrock: 'bedrock',
  bedrock: 'bedrock',
  sagemaker: 'unsupported',
  anyscale: 'unsupported',
  vllm: 'unsupported',
  deepinfra: 'unsupported',
  huggingface: 'unsupported',
  xinference: 'unsupported',
  cloudflareworkersai: 'unsupported',
  ai21: 'unsupported',
  nlpcloud: 'unsupported',
  voyageai: 'unsupported',
  replicate: 'unsupported',
  meta: 'unsupported',
  alephalpha: 'unsupported',
  baseten: 'unsupported',
  customapi: 'unsupported',
  petals: 'unsupported',
  ollama: 'unsupported',
}

export const getProviderIdMapping = (
  providerId: keyof typeof legacyProviderIdMapping
): string => {
  return legacyProviderIdMapping[providerId] || 'unsupported'
}

export function getProvidersWithUserKeys(
  providerData: Record<string, { models: Model[]; apiKey: string }>,
  credentials: { name: string }[]
): Record<string, { models: Model[]; apiKey: string }> {
  const providerApiKeys = Object.keys(providerData).map(
    provider => providerData[provider].apiKey
  )

  const userKeys = credentials.map(cred => cred.name)

  const providerUserKeyMatch = providerApiKeys.filter(apiKey =>
    userKeys.includes(apiKey)
  )

  const providersWithKeys = Object.keys(providerData).reduce<
    Record<string, { models: Model[]; apiKey: string }>
  >((acc, provider) => {
    const { models, apiKey } = providerData[provider]

    if (providerUserKeyMatch.includes(apiKey)) {
      acc[provider] = { models, apiKey }
    }

    return acc
  }, {})

  return providersWithKeys
}
export function isModelAvailableToUser({
  userData,
  model,
  providersWithUserKeys,
}: {
  userData: UserResponse
  model: Model
  providersWithUserKeys: Record<string, { models: Model[]; apiKey: string }>
}): boolean {
  if (userData && userData.user) {
    if (userData.user.hasSubscription) {
      const userSubscriptionName = userData.user.subscriptionName?.trim()

      if (userSubscriptionName === PortalSubscriptions.NEOPHYTE) {
        if (
          userData?.user?.promoCredit > 0 ||
          userData?.user?.introCredit > 0
        ) {
          // All models are available if user has a positive balance
          return true
        }
      }

      if (userSubscriptionName === PortalSubscriptions.WIZARD) {
        // All models are available for Wizard subscription
        return true
      }

      if (userSubscriptionName === PortalSubscriptions.APPRENTICE) {
        const modelMatch =
          providersWithUserKeys[model.provider.provider_name]?.models.includes(
            model
          )

        if (modelMatch) {
          return true
        } else {
          // The user hasn't supplied their own API key for the model's provider
          return false
        }
      }
    } else {
      return false
    }
  }

  // If no subscription and no balance, model is not available
  return false
}

export function groupModelsByProvider(models: Model[]) {
  const providers: Record<
    string,
    { models: Model[]; apiKey: string; providerName: string }
  > = {}
  for (const model of models) {
    const providerId = model.provider.provider_id
    const providerName = model.provider.provider_name
    const providerKey = model.provider.api_key

    if (!providers[providerId]) {
      providers[providerId] = {
        apiKey: providerKey,
        providerName: providerName,
        models: [],
      }
    }
    providers[providerId].models.push(model)
  }
  return providers
}
