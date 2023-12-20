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
    completin_tokens: number
    total_tokens: number
  }
}

interface ICoreLLMService {
  completion: (request: CompletionRequest) => Promise<string>
  streamCompletion: (request: CompletionRequest) => Promise<string>
}

export class CoreLLMService implements ICoreLLMService {
  protected liteLLM: any

  constructor() {
    this.initializeLiteLLM()
  }

  private async initializeLiteLLM() {
    try {
      this.liteLLM = await python('liteLLM')
      this.liteLLM.vertex_project = VERTEXAI_PROJECT
      this.liteLLM.vertex_location = VERTEXAI_LOCATION
    } catch (error) {
      console.error('Error initializing LiteLLM:', error)
      throw error
    }
  }
  // Method to handle standard completion
  async completion(request: CompletionRequest): Promise<string> {
    try {
      const { completions } = await this.liteLLM
      // Construct the request body
      const body = {
        //TODO: Make gemini default model: "gemini-pro"
        model: request.model || 'gemini-pro',
        messages: request.messages,
        ...request.options,
      }

      const response = (await completions(body)) as CompletionResponse

      // Process and return the response
      // Note: Adjust the response processing as per the actual API response structure
      return response.choices.map(choice => choice.message.content).join('\n')
    } catch (error) {
      console.error('Error in completion request:', error)
      throw error
    }
  }

  // Method to handle streaming completion
  async streamCompletion(request: CompletionRequest): Promise<string> {
    try {
      // Ensure that streaming is enabled in the request options
      const body = {
        model: request.model || 'gemini-pro',
        messages: request.messages,
        ...request.options,
        stream: true, // Ensure streaming is true
      }

      const stream = await this.liteLLM.acompletion(body)
      let fullResponse = ''

      // Async iteration over the streaming object
      for await (const chunk of stream) {
        // Handle each chunk as it arrives
        // Assuming chunk structure is similar to the non-streaming response
        const chunkContent = chunk.choices
          .map(choice => choice.message.content)
          .join('\n')
        fullResponse += chunkContent + '\n' // Concatenate chunk content
      }

      return fullResponse.trim() // Remove trailing newline
    } catch (error) {
      console.error('Error in stream completion request:', error)
      throw error
    }
  }
}
