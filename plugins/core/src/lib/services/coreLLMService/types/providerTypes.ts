import { PluginCredential } from 'server/credentials'
import { CompletionModels } from './completionModels'
import { EmbeddingModels } from '../../coreEmbeddingService/types'

export enum LLMProviders {
  OpenAI = 'openai',
  Azure = 'azure_openai',
  Anthropic = 'anthropic',
  Sagemaker = 'sagemaker',
  Bedrock = 'aws_bedrock',
  Anyscale = 'anyscale',
  PerplexityAI = 'perplexity',
  VLLM = 'vllm',
  DeepInfra = 'deepinfra',
  Cohere = 'cohere',
  TogetherAI = 'together',
  AlephAlpha = 'alephalpha',
  Baseten = 'baseten',
  OpenRouter = 'openrouter',
  CustomAPI = 'customapi',
  // CustomOpenAI = 'custom_openai',
  Petals = 'petals',
  Ollama = 'ollama',
  GoogleAIStudio = 'google',
  Palm = 'palm',
  HuggingFace = 'huggingface',
  Xinference = 'xinference',
  CloudflareWorkersAI = 'cloudflareworkersai',
  AI21 = 'ai21',
  NLPCloud = 'nlpcloud',
  VoyageAI = 'voyageai',
  Replicate = 'replicate',
  Meta = 'meta',
  Mistral = 'mistralai',
  VertexAI = 'vertexai',
}

export enum LLMProviderDisplayNames {
  OpenAI = 'OpenAI',
  Azure = 'Azure OpenAI',
  Anthropic = 'Anthropic',
  Sagemaker = 'Sagemaker',
  Bedrock = 'AWS Bedrock',
  Anyscale = 'Anyscale',
  PerplexityAI = 'Perplexity AI',
  VLLM = 'VLLM',
  DeepInfra = 'DeepInfra',
  Cohere = 'Cohere',
  TogetherAI = 'Together AI',
  AlephAlpha = 'Aleph Alpha',
  Baseten = 'Baseten',
  OpenRouter = 'OpenRouter',
  CustomAPI = 'Custom API',
  CustomOpenAI = 'Custom OpenAI',
  Petals = 'Petals',
  Ollama = 'Ollama',
  GoogleAIStudio = 'Gemini - Google AI Studio',
  Palm = 'Palm',
  HuggingFace = 'Hugging Face',
  Xinference = 'Xinference',
  CloudflareWorkersAI = 'Cloudflare Workers AI',
  AI21 = 'AI21',
  NLPCloud = 'NLP Cloud',
  VoyageAI = 'Voyage AI',
  Replicate = 'Replicate',
  Meta = 'Meta',
  Mistral = 'Mistral AI',
  VertexAI = 'Vertex AI',
}

export enum LLMProviderPrefixes {
  Azure = 'azure',
  Sagemaker = 'sagemaker',
  Bedrock = 'bedrock',
  Anyscale = 'anyscale',
  PerplexityAI = 'perplexity',
  VLLM = 'vllm',
  DeepInfra = 'deepinfra',
  TogetherAI = 'together_ai',
  Baseten = 'baseten',
  OpenRouter = 'openrouter',
  CustomOpenAI = 'openai',
  Petals = 'petals',
  Ollama = 'ollama',
  GoogleAIStudio = 'gemini',
  Palm = 'palm',
  HuggingFace = 'huggingface',
  Xinference = 'xinference',
  CloudflareWorkersAI = 'cloudflare',
  VoyageAI = 'voyage',
  Replicate = 'replicate/deployments',
  Mistral = 'mistral',
}

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
  Unknown = 'unknown',
}

export type ProviderRecord = {
  provider: LLMProviders
  displayName: LLMProviderDisplayNames
  keyName: LLMProviderKeys
  completionModels: CompletionModels[]
  embeddingModels: EmbeddingModels[]
  allModels: (CompletionModels | EmbeddingModels)[]
  vendorModelPrefix: LLMProviderPrefixes | ''
}

export type LLMCredential = PluginCredential & {
  value: string
}
