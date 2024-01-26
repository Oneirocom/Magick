import { ActiveProviders, LLMProviders } from '../types/providerTypes'

export const activeProviders: ActiveProviders[] = [
  LLMProviders.OpenAI,
  LLMProviders.TogetherAI,
  LLMProviders.GoogleAIStudio,
  // LLMProviders.VertexAI,
]
