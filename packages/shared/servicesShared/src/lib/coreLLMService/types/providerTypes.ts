import { PluginCredential } from 'server/credentials'
export enum LLMProviderKeys {
  OpenAI = 'OPENAI_API_KEY',
  Azure = 'AZURE_API_KEY',
  Anthropic = 'ANTHROPIC_API_KEY',
  Sagemaker = 'SAGEMAKER_API_KEY',
  Bedrock = 'BEDROCK_API_KEY',
  Anyscale = 'ANYSCALE_API_KEY',
  PerplexityAI = 'PERPLEXITY_API_KEY',
  VLLM = 'VLLM_API_KEY',
  DeepInfra = 'DEEPINFRA_API_KEY',
  Cohere = 'COHERE_API_KEY',
  TogetherAI = 'TOGETHERAI_API_KEY',
  AlephAlpha = 'ALEPH_ALPHA_API_KEY',
  Baseten = 'BASETEN_API_KEY',
  OpenRouter = 'OPENROUTER_API_KEY',
  CustomAPI = 'CUSTOM_API_KEY',
  Petals = 'PETALS_API_KEY',
  Ollama = 'OLLAMA_API_KEY',
  GoogleAIStudio = 'GEMINI_API_KEY',
  Palm = 'PALM_API_KEY',
  HuggingFace = 'HUGGINGFACE_API_KEY',
  Xinference = 'XINFERENCE_API_KEY',
  CloudflareWorkersAI = 'CLOUDFLAREWORKERSAI_API_KEY',
  AI21 = 'AI21_API_KEY',
  NLPCloud = 'NLPCLOUD_API_KEY',
  VoyageAI = 'VOYAGEAI_API_KEY',
  Replicate = 'REPLICATE_API_KEY',
  Meta = 'META_API_KEY',
  Mistral = 'MISTRAL_API_KEY',
  VertexAI = 'VERTEXAI_API_KEY',
  Groq = 'GROQ_API_KEY',
  Unknown = 'unknown',
}

export type LLMCredential = PluginCredential & {
  value: string
}
