import { CompletionModels } from './completionModels'

export type LiteLLMOptions = {
  api_base?: string
  api_version?: string
  api_key?: string
  num_retries?: number
  context_window_fallback_dict?: Record<string, string>
  fallbacks?: Array<Record<string, unknown>>
  metadata?: Record<string, unknown>
}

export type FunctionType = {
  name: string
  description?: string
  parameters: Record<string, unknown>
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
  model: CompletionModels
  messages: Message[]
  options?: CompletionOptions
  api_key?: string
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
  _python_object: any
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

export type Chunk = {
  choices: ChunkChoice[]
}

export type ChunkChoice = {
  finish_reason: string
  index: number
  delta: {
    function_call: string
    tool_calls: string
    content: string
    role: string
  }
}

export type Choice = {
  finish_reason: string
  index: number
  message: {
    role: string
    content: string
  }
}
