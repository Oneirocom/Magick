import { EmbeddingModels } from '../../coreEmbeddingService/types'
import { CompletionModels } from './completionModels'

export type Models = EmbeddingModels | CompletionModels

export type AllModels = CompletionModels | EmbeddingModels
