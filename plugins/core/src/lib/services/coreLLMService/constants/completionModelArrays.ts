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
