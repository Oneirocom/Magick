import { type PluginCredential } from 'server/credentials'

export type FunctionType = {
  name: string
  description?: string
  parameters: Record<string, unknown>
}

export type Message = {
  role: string
  content: string | null
  name?: string
  function_call?: {
    type: string
    function: FunctionType
  }
}

export type LiteLLMOptions = {
  api_base?: string
  api_version?: string
  api_key?: string
  num_retries?: number
  context_window_fallback_dict?: Record<string, string>
  fallbacks?: Array<Record<string, unknown>>
  metadata?: Record<string, unknown>
}

export type ToolType = {
  type: string
  function: FunctionType
}

export type CompletionOptions = {
  temperature?: number
  top_p?: number
  n?: number
  stream?: boolean
  stop?: string | string[]
  max_tokens?: number
  presence_penalty?: number
  frequency_penalty?: number
  logit_bias?: Record<string, number>
  user?: string
  deployment_id?: string
  request_timeout?: number
  response_format?: {
    type: string
  }
  seed?: number
  tools?: ToolType[]
  tool_choice?: string | ToolType
  functions?: FunctionType[]
  function_call?: string
} & LiteLLMOptions

export type CompletionRequest = {
  model: LLMModels
  messages: Message[]
  options?: CompletionOptions
  api_key?: string
}

export type Choice = {
  finish_reason: string
  index: number
  delta: {
    function_call: string
    tool_calls: string
    content: string
    role: string
  }
}
export type CompletionResponse = {
  id: string
  choices: Choice[]
  created: string
  model: string
  object: string
  system_fingerprint: any | null
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export enum LLMProviders {
  OpenAI = 'OPENAI_API_KEY',
  Unknown = 'unknown',
}

export enum LLMModels {
  GPT35Turbo = 'gpt-3.5-turbo',
  GPT3 = 'gpt-3',
  Davinci = 'davinci',
  Curie = 'curie',
  Babbage = 'babbage',
  Ada = 'ada',
  GeminiPro = 'gemini-pro',
  Palm = 'palm',
  Mistral = 'mistral',
  Anthropic = 'anthropic',
  Sagemaker = 'sagemaker',
  Bedrock = 'bedrock',
  Anyscale = 'anyscale',
  PerplexityAI = 'perplexity-ai',
  VLLM = 'vllm',
  DeepInfra = 'deepinfra',
  J2Light = 'j2-light',
  J2Mid = 'j2-mid',
  J2Ultra = 'j2-ultra',
  NLPCloud = 'nlpc-cloud',
  Replicate = 'replicate',
  Cohere = 'cohere',
  TogetherAI = 'together-ai',
  AlephAlpha = 'aleph-alpha',
  Baseten = 'baseten',
  OpenRouter = 'openrouter',
  CustomAPI = 'custom-api',
  Petals = 'petals',
}

export type LLMCredential = PluginCredential & {
  value: string
}

export type LLMModel = [LLMModels, LLMProviders]
