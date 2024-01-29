import { modelProviderMap } from './constants/modelProviderMap'
import { providerModelMap } from './constants/providerModelMap'
import { AllModels } from './types/models'
import { LLMProviderKeys, LLMProviders } from './types/providerTypes'

const providerKeyMap = {
  [LLMProviderKeys.OpenAI]: LLMProviders.OpenAI,
  [LLMProviderKeys.Azure]: LLMProviders.Azure,
  [LLMProviderKeys.Anthropic]: LLMProviders.Anthropic,
  [LLMProviderKeys.Sagemaker]: LLMProviders.Sagemaker,
  [LLMProviderKeys.Bedrock]: LLMProviders.Bedrock,
  [LLMProviderKeys.Anyscale]: LLMProviders.Anyscale,
  [LLMProviderKeys.PerplexityAI]: LLMProviders.PerplexityAI,
  [LLMProviderKeys.VLLM]: LLMProviders.VLLM,
  [LLMProviderKeys.DeepInfra]: LLMProviders.DeepInfra,
  [LLMProviderKeys.Cohere]: LLMProviders.Cohere,
  [LLMProviderKeys.TogetherAI]: LLMProviders.TogetherAI,
  [LLMProviderKeys.AlephAlpha]: LLMProviders.AlephAlpha,
  [LLMProviderKeys.Baseten]: LLMProviders.Baseten,
  [LLMProviderKeys.OpenRouter]: LLMProviders.OpenRouter,
  [LLMProviderKeys.CustomAPI]: LLMProviders.CustomAPI,
  [LLMProviderKeys.CustomOpenAI]: LLMProviders.CustomOpenAI,
  [LLMProviderKeys.Petals]: LLMProviders.Petals,
  [LLMProviderKeys.Ollama]: LLMProviders.Ollama,
  [LLMProviderKeys.GoogleAIStudio]: LLMProviders.GoogleAIStudio,
  [LLMProviderKeys.Palm]: LLMProviders.Palm,
  [LLMProviderKeys.HuggingFace]: LLMProviders.HuggingFace,
  [LLMProviderKeys.Xinference]: LLMProviders.Xinference,
  [LLMProviderKeys.CloudflareWorkersAI]: LLMProviders.CloudflareWorkersAI,
  [LLMProviderKeys.AI21]: LLMProviders.AI21,
  [LLMProviderKeys.NLPCloud]: LLMProviders.NLPCloud,
  [LLMProviderKeys.VoyageAI]: LLMProviders.VoyageAI,
  [LLMProviderKeys.Replicate]: LLMProviders.Replicate,
  [LLMProviderKeys.Meta]: LLMProviders.Meta,
  [LLMProviderKeys.Mistral]: LLMProviders.Mistral,
  [LLMProviderKeys.VertexAI]: LLMProviders,
}

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
  return keys.map(key => providerKeyMap[key]).filter(Provider => Provider)
}
