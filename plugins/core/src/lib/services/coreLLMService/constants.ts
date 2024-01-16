import { EmbeddingModels, LLMModels, LLMProviders } from './types'

export const modelMap: Record<LLMModels | EmbeddingModels, LLMProviders> = {
  [EmbeddingModels.Ada002]: LLMProviders.OpenAI,
  [LLMModels.GPT35Turbo]: LLMProviders.OpenAI,
  [LLMModels.GPT35Turbo1106]: LLMProviders.OpenAI,
  [LLMModels.GPT35Turbo0301]: LLMProviders.OpenAI,
  [LLMModels.GPT35Turbo0613]: LLMProviders.OpenAI,
  [LLMModels.GPT35Turbo16k]: LLMProviders.OpenAI,
  [LLMModels.GPT35Turbo16k0613]: LLMProviders.OpenAI,
  [LLMModels.GPT3]: LLMProviders.OpenAI,
  [LLMModels.Davinci]: LLMProviders.OpenAI,
  [LLMModels.Curie]: LLMProviders.OpenAI,
  [LLMModels.Babbage]: LLMProviders.OpenAI,
  [LLMModels.Ada]: LLMProviders.OpenAI,
  [LLMModels.GPT4]: LLMProviders.OpenAI,
  [LLMModels.GPT41106Preview]: LLMProviders.OpenAI,
  [LLMModels.GPT40314]: LLMProviders.OpenAI,
  [LLMModels.GPT40613]: LLMProviders.OpenAI,
  [LLMModels.GPT432k]: LLMProviders.OpenAI,
  [LLMModels.GPT432k0314]: LLMProviders.OpenAI,
  [LLMModels.GPT432k0613]: LLMProviders.OpenAI,
  [LLMModels.GeminiPro]: LLMProviders.Unknown,
  [LLMModels.Palm]: LLMProviders.Unknown,
  [LLMModels.Mistral]: LLMProviders.Unknown,
  [LLMModels.Anthropic]: LLMProviders.Unknown,
  [LLMModels.Sagemaker]: LLMProviders.Unknown,
  [LLMModels.Bedrock]: LLMProviders.Unknown,
  [LLMModels.Anyscale]: LLMProviders.Unknown,
  [LLMModels.PerplexityAI]: LLMProviders.Unknown,
  [LLMModels.VLLM]: LLMProviders.Unknown,
  [LLMModels.DeepInfra]: LLMProviders.Unknown,
  [LLMModels.J2Light]: LLMProviders.Unknown,
  [LLMModels.J2Mid]: LLMProviders.Unknown,
  [LLMModels.J2Ultra]: LLMProviders.Unknown,
  [LLMModels.NLPCloud]: LLMProviders.Unknown,
  [LLMModels.Replicate]: LLMProviders.Unknown,
  [LLMModels.Cohere]: LLMProviders.Unknown,
  [LLMModels.TogetherAI]: LLMProviders.Unknown,
  [LLMModels.AlephAlpha]: LLMProviders.Unknown,
  [LLMModels.Baseten]: LLMProviders.Unknown,
  [LLMModels.OpenRouter]: LLMProviders.Unknown,
  [LLMModels.CustomAPI]: LLMProviders.Unknown,
  [LLMModels.Petals]: LLMProviders.Unknown,
}

export const embeddingProviderMap: Record<EmbeddingModels, string> = {
  [EmbeddingModels.Ada002]: 'openai',
}

export const modelProviderMap: Record<LLMModels, string> = {
  [LLMModels.GPT35Turbo]: 'openai',
  [LLMModels.GPT35Turbo1106]: 'openai',
  [LLMModels.GPT35Turbo0301]: 'openai',
  [LLMModels.GPT35Turbo0613]: 'openai',
  [LLMModels.GPT35Turbo16k]: 'openai',
  [LLMModels.GPT35Turbo16k0613]: 'openai',
  [LLMModels.GPT4]: 'openai',
  [LLMModels.GPT41106Preview]: 'openai',
  [LLMModels.GPT40314]: 'openai',
  [LLMModels.GPT40613]: 'openai',
  [LLMModels.GPT432k]: 'openai',
  [LLMModels.GPT432k0314]: 'openai',
  [LLMModels.GPT432k0613]: 'openai',
  [LLMModels.GPT3]: 'openai',
  [LLMModels.Davinci]: 'openai',
  [LLMModels.Curie]: 'openai',
  [LLMModels.Babbage]: 'openai',
  [LLMModels.Ada]: 'openai',
  [LLMModels.GeminiPro]: 'Unknown Provider',
  [LLMModels.Palm]: 'Unknown Provider',
  [LLMModels.Mistral]: 'Unknown Provider',
  [LLMModels.Anthropic]: 'Unknown Provider',
  [LLMModels.Sagemaker]: 'Unknown Provider',
  [LLMModels.Bedrock]: 'Unknown Provider',
  [LLMModels.Anyscale]: 'Unknown Provider',
  [LLMModels.PerplexityAI]: 'Unknown Provider',
  [LLMModels.VLLM]: 'Unknown Provider',
  [LLMModels.DeepInfra]: 'Unknown Provider',
  [LLMModels.J2Light]: 'Unknown Provider',
  [LLMModels.J2Mid]: 'Unknown Provider',
  [LLMModels.J2Ultra]: 'Unknown Provider',
  [LLMModels.NLPCloud]: 'Unknown Provider',
  [LLMModels.Replicate]: 'Unknown Provider',
  [LLMModels.Cohere]: 'Unknown Provider',
  [LLMModels.TogetherAI]: 'Unknown Provider',
  [LLMModels.AlephAlpha]: 'Unknown Provider',
  [LLMModels.Baseten]: 'Unknown Provider',
  [LLMModels.OpenRouter]: 'Unknown Provider',
  [LLMModels.CustomAPI]: 'Unknown Provider',
  [LLMModels.Petals]: 'Unknown Provider',
}
