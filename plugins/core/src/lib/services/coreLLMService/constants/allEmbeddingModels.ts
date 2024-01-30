import { EmbeddingModels } from '../../coreEmbeddingService/types'
import {
  bedrockEmbeddingModelsArray,
  cohereEmbeddingModelsArray,
  huggingFaceEmbeddingModelsArray,
  mistralEmbeddingModelsArray,
  openAIEmbeddingModelsArray,
  voyageEmbeddingModelsArray,
} from './embeddingModelArrays'

export const allEmbeddingModels: EmbeddingModels[] = [
  ...bedrockEmbeddingModelsArray,
  ...cohereEmbeddingModelsArray,
  ...mistralEmbeddingModelsArray,
  ...voyageEmbeddingModelsArray,
  ...openAIEmbeddingModelsArray,
  ...huggingFaceEmbeddingModelsArray,
]
