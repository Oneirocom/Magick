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

export enum EmbeddingProviderType {
  OpenAI = 'OpenAI',
  Azure = 'Azure',
  CustomOpenAI = 'CustomOpenAI',
  Bedrock = 'Bedrock',
  Cohere = 'Cohere',
  HuggingFace = 'HuggingFace',
  Mistral = 'Mistral',
  Voyage = 'Voyage',
}

export type GenerateEmbeddingParams =
  | (BaseEmbeddingOptions & {
      provider: EmbeddingProviderType.OpenAI
      options: OpenAIEmbeddingOptions
    })
  | (BaseEmbeddingOptions & {
      provider: EmbeddingProviderType.Azure
      options: AzureEmbeddingOptions
    })
  | (BaseEmbeddingOptions & {
      provider: EmbeddingProviderType.CustomOpenAI
      options: CustomOpenAIEmbeddingOptions
    })
  | (BaseEmbeddingOptions & {
      provider: EmbeddingProviderType.Bedrock
      options: BedrockEmbeddingOptions
    })
  | (BaseEmbeddingOptions & {
      provider: EmbeddingProviderType.Cohere
      options: CohereEmbeddingOptions
    })
  | (BaseEmbeddingOptions & {
      provider: EmbeddingProviderType.HuggingFace
      options: HuggingFaceEmbeddingOptions
    })
  | (BaseEmbeddingOptions & {
      provider: EmbeddingProviderType.Mistral
      options: MistralEmbeddingOptions
    })
  | (BaseEmbeddingOptions & {
      provider: EmbeddingProviderType.Voyage
      options: VoyageEmbeddingOptions
    })

type IOpenAIEmbeddingOptions = 'text-embedding-ada-002'

// Azure-specific embedding options
export interface AzureEmbeddingOptions extends BaseEmbeddingOptions {
  model: string // e.g., 'azure/custom-model-name'
  api_key: string
  api_base: string
  api_version: string
}

export interface OpenAIEmbeddingOptions extends BaseEmbeddingOptions {
  model: IOpenAIEmbeddingOptions
}

// Use this for calling /embedding endpoints on OpenAI Compatible Servers
export interface CustomOpenAIEmbeddingOptions extends BaseEmbeddingOptions {
  model: string // e.g., 'openai/<your-llm-name>'
  api_base: string // The API endpoint "http://0.0.0.0:8000/"
}

export type BedrockModels =
  | 'amazon.titan-embed-text-v1'
  | 'cohere.embed-english-v3'
  | 'cohere.embed-multilingual-v3'
// Bedrock Embedding Options
export interface BedrockEmbeddingOptions extends BaseEmbeddingOptions {
  models: BedrockModels
  aws_access_key_id?: string
  aws_secret_access_key?: string
  aws_region_name?: string
}

export type CohereModels =
  | 'embed-english-v3.0'
  | 'embed-english-light-v3.0'
  | 'embed-multilingual-v3.0'
  | 'embed-multilingual-light-v3.0'
  | 'embed-english-v2.0'
  | 'embed-english-light-v2.0'
  | 'embed-multilingual-v2.0'
// Cohere-specific embedding options
export interface CohereEmbeddingOptions extends BaseEmbeddingOptions {
  model: CohereModels // e.g., 'cohere.embed-english-v3.0'
  input_type?: string // Optional parameter for Cohere
}

// HuggingFace-specific embedding options
export interface HuggingFaceEmbeddingOptions extends BaseEmbeddingOptions {
  api_base: string // The API endpoint "https://p69xlsj6rpno5drq.us-east-1.aws.endpoints.huggingface.cloud"
}

type MistralModels = 'mistral/mistral-embed'
// Mistral AI Embedding Options
export interface MistralEmbeddingOptions extends BaseEmbeddingOptions {
  model: MistralModels
}

type VoyageModels =
  | 'voyage/voyage-02'
  | 'voyage/voyage-code-02'
  | 'voyage-lite-01-instruct'
// Voyage-specific embedding options
export interface VoyageEmbeddingOptions extends BaseEmbeddingOptions {
  model: VoyageModels
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
  azureEmbeddingHandler(
    options: AzureEmbeddingOptions
  ): Promise<EmbeddingOutput>
  bedrockEmbeddingHandler(
    options: BedrockEmbeddingOptions
  ): Promise<EmbeddingOutput>
  cohereEmbeddingHandler(
    options: CohereEmbeddingOptions
  ): Promise<EmbeddingOutput>
  huggingFaceEmbeddingHandler(
    options: HuggingFaceEmbeddingOptions
  ): Promise<EmbeddingOutput>
  mistralEmbeddingHandler(
    options: MistralEmbeddingOptions
  ): Promise<EmbeddingOutput>
  voyageEmbeddingHandler(
    options: VoyageEmbeddingOptions
  ): Promise<EmbeddingOutput>
}
