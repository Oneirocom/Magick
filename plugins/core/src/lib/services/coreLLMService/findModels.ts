import {
  allOpenAICompletionModelsArray,
  googleAIStudioModelsArray,
  togetherAIModelsArray,
  palmModelsArray,
  vertexAIGoogleModelsArray,
  ai21ModelsArray,
  anthropicModelsArray,
  alephAlphaModelsArray,
  anyscaleModelsArray,
  baseTenModelsArray,
  bedrockModelsArray,
  cloudflareWorkersAIModelsArray,
  deepInfraChatModelsArray,
  huggingFaceModelsWithPromptFormattingArray,
  mistralAIModelsArray,
  nlpCloudModelsArray,
  ollamaModelsArray,
  openRouterModelsArray,
  perplexityAIModelsArray,
  petalsModelsArray,
  replicateModelsArray,
  sageMakerModelsArray,
  vllmModelsArray,
  voyageAIModelsArray,
  xinferenceModelsArray,
} from './constants/completionModelArrays'
import { LLMProviders } from './types/providerTypes'

// Function to get available models for a given provider
export const getAvailableModelsForProvider = provider => {
  switch (provider) {
    case LLMProviders.OpenAI:
      return allOpenAICompletionModelsArray
    case LLMProviders.GoogleAIStudio:
      return googleAIStudioModelsArray
    case LLMProviders.TogetherAI:
      return togetherAIModelsArray
    case LLMProviders.Palm:
      return palmModelsArray
    case LLMProviders.VertexAI:
      return vertexAIGoogleModelsArray
    case LLMProviders.AI21:
      return ai21ModelsArray
    case LLMProviders.Anthropic:
      return anthropicModelsArray
    case LLMProviders.AlephAlpha:
      return alephAlphaModelsArray
    case LLMProviders.Anyscale:
      return anyscaleModelsArray
    case LLMProviders.Baseten:
      return baseTenModelsArray
    case LLMProviders.Bedrock:
      return bedrockModelsArray
    case LLMProviders.CloudflareWorkersAI:
      return cloudflareWorkersAIModelsArray
    case LLMProviders.DeepInfra:
      return deepInfraChatModelsArray
    case LLMProviders.HuggingFace:
      return huggingFaceModelsWithPromptFormattingArray
    case LLMProviders.Mistral:
      return mistralAIModelsArray
    case LLMProviders.NLPCloud:
      return nlpCloudModelsArray
    case LLMProviders.Ollama:
      return ollamaModelsArray
    case LLMProviders.OpenRouter:
      return openRouterModelsArray
    case LLMProviders.PerplexityAI:
      return perplexityAIModelsArray
    case LLMProviders.Petals:
      return petalsModelsArray
    case LLMProviders.Replicate:
      return replicateModelsArray
    case LLMProviders.Sagemaker:
      return sageMakerModelsArray
    case LLMProviders.VLLM:
      return vllmModelsArray
    case LLMProviders.VoyageAI:
      return voyageAIModelsArray
    case LLMProviders.Xinference:
      return xinferenceModelsArray

    default:
      return []
  }
}
