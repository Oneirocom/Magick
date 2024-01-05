import { python } from 'pythonia'
import { VERTEXAI_LOCATION, VERTEXAI_PROJECT } from 'shared/config'

type FunctionType = {
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

type LiteLLMOptions = {
  api_base?: string
  api_version?: string
  api_key?: string
  num_retries?: number
  context_window_fallback_dict?: Record<string, string>
  fallbacks?: Array<Record<string, unknown>>
  metadata?: Record<string, unknown>
}

type ToolType = {
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

type CompletionRequest = {
  model: string
  messages: Message[]
  options?: CompletionOptions
}

type CompletionResponse = {
  choices: {
    finish_reason: string
    index: number
    message: {
      role: string
      content: string
    }
  }[]

  created: string
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export enum ModelNames {
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

interface ICoreLLMService {
  completion: (request: CompletionRequest) => Promise<CompletionResponse>
  streamCompletion: (
    request: CompletionRequest,
    callback: (chunk, text) => void
  ) => Promise<void>
}

export class CoreLLMService implements ICoreLLMService {
  protected liteLLM: any

  async initialize() {
    try {
      this.liteLLM = await python('litellm')
      this.liteLLM.vertex_project = VERTEXAI_PROJECT
      this.liteLLM.vertex_location = VERTEXAI_LOCATION
    } catch (error) {
      console.error('Error initializing LiteLLM:', error)
      throw error
    }
  }
  // Method to handle standard completion
  async completion(request: CompletionRequest): Promise<CompletionResponse> {
    try {
      // Construct the request body
      const body = {
        //TODO: Make gemini default model: "gemini-pro"
        model: request.model || 'gpt-3.5-turbo',
        messages: request.messages,
        ...request.options,
      }

      // get the raw response from the python bridge
      const rawResponse = await this.liteLLM.completion$(body)

      // process the response into jsonand return it
      const response = await rawResponse.json()

      // return the actual value as a JS object
      return await response.valueOf()
    } catch (error) {
      console.error('Error in completion request:', error)
      throw error
    }
  }

  // Method to handle streaming completion
  async streamCompletion(
    request: CompletionRequest,
    callback: (chunk, text) => void
  ): Promise<void> {
    try {
      // Ensure that streaming is enabled in the request options
      const body = {
        model: request.model || 'gemini-pro',
        messages: request.messages,
        ...request.options,
        stream: true, // Ensure streaming is true
      }

      const stream = await this.liteLLM.completion$(body)
      // Async iteration over the streaming object
      for await (const chunk of stream) {
        // Handle each chunk as it arrives
        // Assuming chunk structure is similar to the non-streaming response
        const rawChunk = await chunk.json()
        const chunkResponse = await rawChunk.valueOf()
        const chunkText = chunkResponse.choices[0].delta.content || ''
        callback(chunkResponse, chunkText)
      }
    } catch (error) {
      console.error('Error in stream completion request:', error)
      throw error
    }
  }
}
