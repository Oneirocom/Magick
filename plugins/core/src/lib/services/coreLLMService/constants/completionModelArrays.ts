import {
  OpenAIChatCompletionModels,
  OpenAITextCompletionInstructModels,
  OpenAIVisionModels,
  HuggingFaceModelsWithPromptFormatting,
  OllamaModels,
  OllamaVisionModels,
  VertexAIGoogleModels,
  MistralAIModels,
  AnthropicModels,
  SageMakerModels,
  BedrockModels,
  PerplexityAIModels,
  VLLMModels,
  XinferenceModels,
  CloudflareWorkersAIModels,
  AI21Models,
  NLPCloudModels,
  DeepInfraChatModels,
  BaseTenModels,
  PetalsModels,
  VoyageAIModels,
  AlephAlphaModels,
  AnyscaleModels,
  OpenRouterModels,
  ReplicateModels,
  TogetherAIModels,
  PalmModels,
  GoogleAIStudioModels,
  CompletionModels,
} from '../types/completionModels'
import { LLMProviderPrefixes } from '../types/providerTypes'

export function appendPrefixToModels(modelsArray, prefix) {
  if (prefix === '') return modelsArray
  return modelsArray.map(model => `${prefix}/${model}`)
}
export function appendPrefixToModel(model, prefix) {
  if (prefix === '') return model
  return `${prefix}/${model}`
}

export const openAIChatCompletionModelsArray = Object.values(
  OpenAIChatCompletionModels
)
export const openAITextCompletionInstructModelsArray = Object.values(
  OpenAITextCompletionInstructModels
)

export const openAIVisionModelsArray = Object.values(OpenAIVisionModels)
export const huggingFaceModelsWithPromptFormattingArray = Object.values(
  HuggingFaceModelsWithPromptFormatting
)
export const ollamaModelsArray = Object.values(OllamaModels)
export const ollamaVisionModelsArray = Object.values(OllamaVisionModels)
export const vertexAIGoogleModelsArray = Object.values(VertexAIGoogleModels)
export const mistralAIModelsArray = Object.values(MistralAIModels)
export const anthropicModelsArray = Object.values(AnthropicModels)
export const sageMakerModelsArray = Object.values(SageMakerModels)
export const bedrockModelsArray = Object.values(BedrockModels)
export const perplexityAIModelsArray = Object.values(PerplexityAIModels)
export const vllmModelsArray = Object.values(VLLMModels)
export const xinferenceModelsArray = Object.values(XinferenceModels)
export const cloudflareWorkersAIModelsArray = Object.values(
  CloudflareWorkersAIModels
)
export const ai21ModelsArray = Object.values(AI21Models)
export const nlpCloudModelsArray = Object.values(NLPCloudModels)
export const deepInfraChatModelsArray = Object.values(DeepInfraChatModels)
export const baseTenModelsArray = Object.values(BaseTenModels)
export const petalsModelsArray = Object.values(PetalsModels)
export const voyageAIModelsArray = Object.values(VoyageAIModels)
export const alephAlphaModelsArray = Object.values(AlephAlphaModels)
export const anyscaleModelsArray = Object.values(AnyscaleModels)
export const openRouterModelsArray = Object.values(OpenRouterModels)
export const replicateModelsArray = Object.values(ReplicateModels)
export const togetherAIModelsArray = Object.values(TogetherAIModels)
export const palmModelsArray = Object.values(PalmModels)
export const googleAIStudioModelsArray = Object.values(GoogleAIStudioModels)
export const allOpenAICompletionModelsArray = [
  ...openAIChatCompletionModelsArray,
  ...openAITextCompletionInstructModelsArray,
  ...openAIVisionModelsArray,
]
export const allOllamaModelsArray = [
  ...ollamaModelsArray,
  ...ollamaVisionModelsArray,
]

export const openAICompletionModelsWithPrefix = appendPrefixToModels(
  openAIChatCompletionModelsArray,
  ''
)
export const ollamaModelsWithPrefix = appendPrefixToModels(
  ollamaModelsArray,
  LLMProviderPrefixes.Ollama
)
export const ollamaVisionModelsWithPrefix = appendPrefixToModels(
  ollamaVisionModelsArray,
  LLMProviderPrefixes.Ollama
)
export const vertexAIGoogleModelsWithPrefix = appendPrefixToModels(
  vertexAIGoogleModelsArray,
  ''
)
export const mistralAIModelsWithPrefix = appendPrefixToModels(
  mistralAIModelsArray,
  LLMProviderPrefixes.Mistral
)
export const anthropicModelsWithPrefix = appendPrefixToModels(
  anthropicModelsArray,
  ''
)
export const sageMakerModelsWithPrefix = appendPrefixToModels(
  sageMakerModelsArray,
  LLMProviderPrefixes.Sagemaker
)
export const bedrockModelsWithPrefix = appendPrefixToModels(
  bedrockModelsArray,
  LLMProviderPrefixes.Bedrock
)
export const perplexityAIModelsWithPrefix = appendPrefixToModels(
  perplexityAIModelsArray,
  LLMProviderPrefixes.PerplexityAI
)
export const vllmModelsWithPrefix = appendPrefixToModels(
  vllmModelsArray,
  LLMProviderPrefixes.VLLM
)
export const xinferenceModelsWithPrefix = appendPrefixToModels(
  xinferenceModelsArray,
  LLMProviderPrefixes.Xinference
)
export const cloudflareWorkersAIModelsWithPrefix = appendPrefixToModels(
  cloudflareWorkersAIModelsArray,
  LLMProviderPrefixes.CloudflareWorkersAI
)
export const ai21ModelsWithPrefix = appendPrefixToModels(ai21ModelsArray, '')
export const nlpCloudModelsWithPrefix = appendPrefixToModels(
  nlpCloudModelsArray,
  ''
)
export const deepInfraChatModelsWithPrefix = appendPrefixToModels(
  deepInfraChatModelsArray,
  LLMProviderPrefixes.DeepInfra
)
export const baseTenModelsWithPrefix = appendPrefixToModels(
  baseTenModelsArray,
  LLMProviderPrefixes.Baseten
)
export const petalsModelsWithPrefix = appendPrefixToModels(
  petalsModelsArray,
  LLMProviderPrefixes.Petals
)
export const voyageAIModelsWithPrefix = appendPrefixToModels(
  voyageAIModelsArray,
  LLMProviderPrefixes.VoyageAI
)
export const alephAlphaModelsWithPrefix = appendPrefixToModels(
  alephAlphaModelsArray,
  ''
)
export const anyscaleModelsWithPrefix = appendPrefixToModels(
  anyscaleModelsArray,
  LLMProviderPrefixes.Anyscale
)
export const openRouterModelsWithPrefix = appendPrefixToModels(
  openRouterModelsArray,
  LLMProviderPrefixes.OpenRouter
)
export const replicateModelsWithPrefix = appendPrefixToModels(
  replicateModelsArray,
  LLMProviderPrefixes.Replicate
)
export const togetherAIModelsWithPrefix = appendPrefixToModels(
  togetherAIModelsArray,
  LLMProviderPrefixes.TogetherAI
)
export const palmModelsWithPrefix = appendPrefixToModels(
  palmModelsArray,
  LLMProviderPrefixes.Palm
)
export const googleAIStudioModelsWithPrefix = appendPrefixToModels(
  googleAIStudioModelsArray,
  LLMProviderPrefixes.GoogleAIStudio
)

export const allOpenAICompletionModelsWithPrefix = appendPrefixToModels(
  allOpenAICompletionModelsArray,
  ''
)

export const allOllamaModelsWithPrefix = appendPrefixToModels(
  allOllamaModelsArray,
  LLMProviderPrefixes.Ollama
)

export const huggingFaceModelsWithPromptFormattingWithPrefix =
  appendPrefixToModels(
    huggingFaceModelsWithPromptFormattingArray,
    LLMProviderPrefixes.HuggingFace
  )

export const allCompletionModels: CompletionModels[] = [
  ...openAIChatCompletionModelsArray,
  ...openAITextCompletionInstructModelsArray,
  ...openAIVisionModelsArray,
  ...huggingFaceModelsWithPromptFormattingArray,
  ...ollamaModelsArray,
  ...ollamaVisionModelsArray,
  ...vertexAIGoogleModelsArray,
  ...palmModelsArray,
  ...googleAIStudioModelsArray,
  ...mistralAIModelsArray,
  ...anthropicModelsArray,
  ...sageMakerModelsArray,
  ...bedrockModelsArray,
  ...perplexityAIModelsArray,
  ...vllmModelsArray,
  ...xinferenceModelsArray,
  ...cloudflareWorkersAIModelsArray,
  ...ai21ModelsArray,
  ...nlpCloudModelsArray,
  ...deepInfraChatModelsArray,
  ...togetherAIModelsArray,
  ...baseTenModelsArray,
  ...petalsModelsArray,
  ...voyageAIModelsArray,
  ...alephAlphaModelsArray,
]

export const allPrefixedCompletionModels = [
  ...allOllamaModelsWithPrefix,
  ...allOpenAICompletionModelsWithPrefix,
  ...vertexAIGoogleModelsWithPrefix,
  ...mistralAIModelsWithPrefix,
  ...anthropicModelsWithPrefix,
  ...sageMakerModelsWithPrefix,
  ...bedrockModelsWithPrefix,
  ...perplexityAIModelsWithPrefix,
  ...vllmModelsWithPrefix,
  ...xinferenceModelsWithPrefix,
  ...cloudflareWorkersAIModelsWithPrefix,
  ...ai21ModelsWithPrefix,
  ...nlpCloudModelsWithPrefix,
  ...deepInfraChatModelsWithPrefix,
  ...baseTenModelsWithPrefix,
  ...petalsModelsWithPrefix,
  ...voyageAIModelsWithPrefix,
  ...alephAlphaModelsWithPrefix,
  ...anyscaleModelsWithPrefix,
  ...openRouterModelsWithPrefix,
  ...replicateModelsWithPrefix,
  ...togetherAIModelsWithPrefix,
  ...palmModelsWithPrefix,
  ...googleAIStudioModelsWithPrefix,
  ...huggingFaceModelsWithPromptFormattingWithPrefix,
]
