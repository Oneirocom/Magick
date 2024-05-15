export interface BaseEmbeddingOptions {
  model: string
  input: string[]
}

export interface EmbeddingOptions {
  user?: string // A unique identifier for the end-user
  timeout?: number // Max time in seconds for the API to respond
  api_base?: string // The API endpoint
  api_version?: string // API version, mainly for Azure
  api_key?: string // API key for authentication and authorization
  api_type?: string // Type of API to use
}

export type GenerateEmbeddingParams =
  | BaseEmbeddingOptions & {
      provider: 'openai'
      options: OpenAIEmbeddingOptions
    }

// OpenAI embedding options
export interface OpenAIEmbeddingOptions extends BaseEmbeddingOptions {
  model: string
}

export interface EmbeddingOutput {
  object: string
  data: EmbeddingData[]
  model: string
  usage: Usage
}

interface EmbeddingData {
  object: string
  index: number
  embedding: number[]
}

interface Usage {
  prompt_tokens: number
  total_tokens: number
}

export interface IEmbeddingService {
  initialize(): Promise<void>
  generateEmbedding(
    options: EmbeddingOptions & BaseEmbeddingOptions
  ): Promise<EmbeddingOutput>
  openAIEmbeddingHandler(
    options: OpenAIEmbeddingOptions
  ): Promise<EmbeddingOutput>
}
