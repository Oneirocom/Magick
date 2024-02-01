import {
  BedrockEmbeddingModels,
  CohereEmbeddingModels,
  MistralEmbeddingModels,
  VoyageEmbeddingModels,
  OpenAIEmbeddingModels,
  HuggingFaceEmbeddingModels,
  EmbeddingModels,
} from '../../coreEmbeddingService/types'
import { LLMProviderPrefixes } from '../types/providerTypes'
import { appendPrefixToModel } from './completionModelArrays'

export const bedrockEmbeddingModelsArray = Object.values(BedrockEmbeddingModels)
export const cohereEmbeddingModelsArray = Object.values(CohereEmbeddingModels)
export const mistralEmbeddingModelsArray = Object.values(MistralEmbeddingModels)
export const voyageEmbeddingModelsArray = Object.values(VoyageEmbeddingModels)
export const openAIEmbeddingModelsArray = Object.values(OpenAIEmbeddingModels)
export const huggingFaceEmbeddingModelsArray = Object.values(
  HuggingFaceEmbeddingModels
)

export const bedrockEmbeddingModelsWithPrefix = appendPrefixToModel(
  bedrockEmbeddingModelsArray,
  ''
)
export const cohereEmbeddingModelsWithPrefix = appendPrefixToModel(
  cohereEmbeddingModelsArray,
  ''
)
export const mistralEmbeddingModelsWithPrefix = appendPrefixToModel(
  mistralEmbeddingModelsArray,
  LLMProviderPrefixes.Mistral
)

export const voyageEmbeddingModelsWithPrefix = appendPrefixToModel(
  voyageEmbeddingModelsArray,
  LLMProviderPrefixes.VoyageAI
)

export const openAIEmbeddingModelsWithPrefix = appendPrefixToModel(
  openAIEmbeddingModelsArray,
  ''
)

export const huggingFaceEmbeddingModelsWithPrefix = appendPrefixToModel(
  huggingFaceEmbeddingModelsArray,
  LLMProviderPrefixes.HuggingFace
)

export const allEmbeddingModels: EmbeddingModels[] = [
  ...bedrockEmbeddingModelsArray,
  ...cohereEmbeddingModelsArray,
  ...mistralEmbeddingModelsArray,
  ...voyageEmbeddingModelsArray,
  ...openAIEmbeddingModelsArray,
  ...huggingFaceEmbeddingModelsArray,
]

export const allEmbeddingModelsWithPrefix: EmbeddingModels[] = [
  ...bedrockEmbeddingModelsWithPrefix,
  ...cohereEmbeddingModelsWithPrefix,
  ...mistralEmbeddingModelsWithPrefix,
  ...voyageEmbeddingModelsWithPrefix,
  ...openAIEmbeddingModelsWithPrefix,
  ...huggingFaceEmbeddingModelsWithPrefix,
]
