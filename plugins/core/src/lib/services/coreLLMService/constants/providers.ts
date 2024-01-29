import { LLMProviders } from '../types/providerTypes'

export type ActiveProviders =
  | LLMProviders.OpenAI
  | LLMProviders.GoogleAIStudio
  | LLMProviders.TogetherAI
  | LLMProviders.Palm
// | LLMProviders.VertexAI

export const activeProviders: ActiveProviders[] = [
  LLMProviders.OpenAI,
  LLMProviders.TogetherAI,
  LLMProviders.GoogleAIStudio,
  LLMProviders.Palm,

  // LLMProviders.VertexAI,
]
