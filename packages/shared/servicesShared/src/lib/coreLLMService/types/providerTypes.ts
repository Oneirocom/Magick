import { PluginCredential } from '@magickml/credentials'

// note these are keywords api key names
export enum LLMProviderKeys {
  OpenAI = 'OPENAI_API_KEY',
  CoHere = 'COHERE_API_KEY',
  Palm = 'PALM_API_KEY',
  GoogleVertexAI = 'GOOGLE_VERTEX_AI_API_KEY',
  GeminiPro = 'GEMINI_PRO_API_KEY',
  Anthropic = 'ANTHROPIC_API_KEY',
  Mistral = 'MISTRAL_API_KEY',
  Azure = 'AZURE_API_KEY',
  AzureVision = 'AZURE_VISION_API_KEY',
  OpenRouter = 'OPEN_ROUTER_API_KEY',
  Groq = 'GROQ_API_KEY',
  Together = 'TOGETHER_API_KEY',
  PerplexityAI = 'PERPLEXITYAI_API_KEY',
  Fireworks = 'FIREWORKS_API_KEY',
  Unknown = 'unknown',
}

export type LLMCredential = PluginCredential & {
  value: string
}
