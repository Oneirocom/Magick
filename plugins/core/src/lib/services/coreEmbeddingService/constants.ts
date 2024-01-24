import { LLMProviders } from '../coreLLMService/types'
import {
  BedrockEmbeddingModels,
  CohereEmbeddingModels,
  EmbeddingModels,
  HuggingFaceEmbeddingModels,
  MistralEmbeddingModels,
  OpenAIEmbeddingModels,
  VoyageEmbeddingModels,
} from './types'

export const embeddingProviderMap: Record<EmbeddingModels, LLMProviders> = {
  // Bedrock models
  [BedrockEmbeddingModels.AmazonTitanEmbedTextV1]: LLMProviders.Bedrock,
  [BedrockEmbeddingModels.CohereEmbedEnglishV3]: LLMProviders.Bedrock,
  [BedrockEmbeddingModels.CohereEmbedMultilingualV3]: LLMProviders.Bedrock,

  // Cohere models
  [CohereEmbeddingModels.EmbedEnglishLightV20]: LLMProviders.Cohere,
  [CohereEmbeddingModels.EmbedEnglishLightV30]: LLMProviders.Cohere,
  [CohereEmbeddingModels.EmbedEnglishV20]: LLMProviders.Cohere,
  [CohereEmbeddingModels.EmbedEnglishV30]: LLMProviders.Cohere,
  [CohereEmbeddingModels.EmbedMultilingualLightV30]: LLMProviders.Cohere,
  [CohereEmbeddingModels.EmbedMultilingualV20]: LLMProviders.Cohere,
  [CohereEmbeddingModels.EmbedMultilingualV30]: LLMProviders.Cohere,

  // Mistral models
  [MistralEmbeddingModels.MistralEmbed]: LLMProviders.Mistral,

  // Voyage models
  [VoyageEmbeddingModels.Voyage02]: LLMProviders.VoyageAI,
  [VoyageEmbeddingModels.VoyageCode02]: LLMProviders.VoyageAI,
  [VoyageEmbeddingModels.VoyageLite01Instruct]: LLMProviders.VoyageAI,

  // OpenAI models
  [OpenAIEmbeddingModels.TextEmbeddingAda002]: LLMProviders.OpenAI,

  // HuggingFace models
  [HuggingFaceEmbeddingModels.HuggingFaceMicrosoftCodebertBase]:
    LLMProviders.HuggingFace,
  [HuggingFaceEmbeddingModels.HuggingFaceBAAIBgeLargeZh]:
    LLMProviders.HuggingFace,
  [HuggingFaceEmbeddingModels.HuggingFaceAnyHfEmbeddingModel]:
    LLMProviders.HuggingFace,
}

const bedrockEmbeddingModelsArray = Object.values(BedrockEmbeddingModels)
const cohereEmbeddingModelsArray = Object.values(CohereEmbeddingModels)
const mistralEmbeddingModelsArray = Object.values(MistralEmbeddingModels)
const voyageEmbeddingModelsArray = Object.values(VoyageEmbeddingModels)
const openAIEmbeddingModelsArray = Object.values(OpenAIEmbeddingModels)
const huggingFaceEmbeddingModelsArray = Object.values(
  HuggingFaceEmbeddingModels
)

export const allEmbeddingModels: EmbeddingModels[] = [
  ...bedrockEmbeddingModelsArray,
  ...cohereEmbeddingModelsArray,
  ...mistralEmbeddingModelsArray,
  ...voyageEmbeddingModelsArray,
  ...openAIEmbeddingModelsArray,
  ...huggingFaceEmbeddingModelsArray,
]
