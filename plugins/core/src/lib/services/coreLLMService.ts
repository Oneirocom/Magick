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

// type CompletionResponse = {
//   choices: {
//     finish_reason: string
//     index: number
//     message: {
//       role: string
//       content: string
//     }
//   }[]

//   created: string
//   model: string
//   usage: {
//     prompt_tokens: number
//     completion_tokens: number
//     total_tokens: number
//   }
// }

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

type CompletionParams = {
  request: CompletionRequest
  callback: (chunk: string, isDone: boolean) => void
  maxRetries: number
}

interface ICoreLLMService {
  /**
   * Handles completion requests in streaming mode. Accumulates the text from each chunk and returns the complete text.
   *
   * @param request The completion request parameters.
   * @param callback A callback function that receives each chunk of text and a flag indicating if the streaming is done.
   * @returns A promise that resolves to the complete text after all chunks have been received.
   */
  completion: (params: CompletionParams) => Promise<string>
}

export class CoreLLMService implements ICoreLLMService {
  protected liteLLM: any

  async initialize() {
    try {
      this.liteLLM = await python('litellm')
      this.liteLLM.vertex_project = VERTEXAI_PROJECT
      this.liteLLM.vertex_location = VERTEXAI_LOCATION
      this.liteLLM.set_verbose = true
    } catch (error: any) {
      console.error('Error initializing LiteLLM:', error)
      throw new Error(`Initialization failed: ${error}`)
    }
  }

  // Method to handle completion (always in streaming mode)
  async completion({
    request,
    callback,
    maxRetries = 3,
  }: CompletionParams): Promise<string> {
    let attempts = 0

    while (attempts < maxRetries) {
      try {
        const body = {
          model: request.model || 'gemini-pro',
          messages: request.messages,
          ...request.options,
          stream: true,
        }

        let fullText = ''

        const stream = await this.liteLLM.completion$(body)
        for await (const chunk of stream) {
          const rawChunk = await chunk.json()
          const chunkResponse = await rawChunk.valueOf()
          const chunkText = chunkResponse.choices[0].delta.content || ''
          fullText += chunkText
          callback(chunkText, false)
        }

        fullText += '<<END>>'
        callback('', true)
        return fullText
      } catch (error: any) {
        console.error(`Attempt ${attempts + 1} failed:`, error)
        attempts++

        if (attempts >= maxRetries) {
          throw new Error(
            `Completion request failed after ${maxRetries} attempts: ${error}`
          )
        }
      }
    }
    throw new Error('Unexpected error in completion method')
  }
}
