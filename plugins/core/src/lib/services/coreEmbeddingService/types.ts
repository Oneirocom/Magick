import {
  AzureSlug,
  BedrockSlug,
  CustomOpenAISlug,
  HuggingFaceSlug,
  MistralAISlug,
  VoyageAISlug,
} from '../coreLLMService/types/completionModels'
import { LLMProviders } from '../coreLLMService/types/providerTypes'

export interface BaseEmbeddingOptions {
  model: EmbeddingModels | string
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
  | (BaseEmbeddingOptions & {
      provider: LLMProviders.OpenAI
      options: OpenAIEmbeddingOptions
    })
  | (BaseEmbeddingOptions & {
      provider: LLMProviders.Azure
      options: AzureEmbeddingOptions
    })
  // | (BaseEmbeddingOptions & {
  //     provider: LLMProviders.CustomOpenAI
  //     options: CustomOpenAIEmbeddingOptions
  //   })
  | (BaseEmbeddingOptions & {
      provider: LLMProviders.Bedrock
      options: BedrockEmbeddingOptions
    })
  | (BaseEmbeddingOptions & {
      provider: LLMProviders.Cohere
      options: CohereEmbeddingOptions
    })
  | (BaseEmbeddingOptions & {
      provider: LLMProviders.HuggingFace
      options: HuggingFaceEmbeddingOptions
    })
  | (BaseEmbeddingOptions & {
      provider: LLMProviders.Mistral
      options: MistralEmbeddingOptions
    })
  | (BaseEmbeddingOptions & {
      provider: LLMProviders.VoyageAI
      options: VoyageEmbeddingOptions
    })

// Azure-specific embedding options
export interface AzureEmbeddingOptions extends BaseEmbeddingOptions {
  model: AzureSlug
  api_key: string
  api_base: string
  api_version: string
}

export interface OpenAIEmbeddingOptions extends BaseEmbeddingOptions {
  model: OpenAIEmbeddingModels
}

// Use this for calling /embedding endpoints on OpenAI Compatible Servers
export interface CustomOpenAIEmbeddingOptions extends BaseEmbeddingOptions {
  model: CustomOpenAISlug
  api_base: string // The API endpoint "http://0.0.0.0:8000/"
}

// Bedrock Embedding Options
export interface BedrockEmbeddingOptions extends BaseEmbeddingOptions {
  models: BedrockSlug
  aws_access_key_id?: string
  aws_secret_access_key?: string
  aws_region_name?: string
}

// Cohere-specific embedding options
export interface CohereEmbeddingOptions extends BaseEmbeddingOptions {
  model: CohereEmbeddingModels
  input_type?: string
}

// HuggingFace-specific embedding options
export interface HuggingFaceEmbeddingOptions extends BaseEmbeddingOptions {
  model: HuggingFaceSlug
  api_base: string // The API endpoint "https://p69xlsj6rpno5drq.us-east-1.aws.endpoints.huggingface.cloud"
}

// Mistral AI Embedding Options
export interface MistralEmbeddingOptions extends BaseEmbeddingOptions {
  model: MistralAISlug
}

// Voyage-specific embedding options
export interface VoyageEmbeddingOptions extends BaseEmbeddingOptions {
  model: VoyageAISlug
}

// OpenAI embedding options
export interface OpenAIEmbeddingOptions extends BaseEmbeddingOptions {
  model: OpenAIEmbeddingModels
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

export type EmbeddingModels =
  | OpenAIEmbeddingModels
  | BedrockEmbeddingModels
  | CohereEmbeddingModels
  | HuggingFaceEmbeddingModels
  | MistralEmbeddingModels
  | VoyageEmbeddingModels

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

export enum BedrockEmbeddingModels {
  AmazonTitanEmbedTextV1 = 'amazon.titan-embed-text-v1',
  CohereEmbedEnglishV3 = 'cohere.embed-english-v3',
  CohereEmbedMultilingualV3 = 'cohere.embed-multilingual-v3',
}

export enum CohereEmbeddingModels {
  EmbedEnglishV30 = 'embed-english-v3.0',
  EmbedEnglishLightV30 = 'embed-english-light-v3.0',
  EmbedMultilingualV30 = 'embed-multilingual-v3.0',
  EmbedMultilingualLightV30 = 'embed-multilingual-light-v3.0',
  EmbedEnglishV20 = 'embed-english-v2.0',
  EmbedEnglishLightV20 = 'embed-english-light-v2.0',
  EmbedMultilingualV20 = 'embed-multilingual-v2.0',
}

export enum MistralEmbeddingModels {
  MistralEmbed = 'mistral-embed',
}

export enum VoyageEmbeddingModels {
  Voyage02 = 'voyage/voyage-02',
  VoyageCode02 = 'voyage/voyage-code-02',
  VoyageLite01Instruct = 'voyage-lite-01-instruct',
}

export enum OpenAIEmbeddingModels {
  TextEmbeddingAda002 = 'text-embedding-ada-002',
}

export enum HuggingFaceEmbeddingModels {
  HuggingFaceMicrosoftCodebertBase = 'microsoft/codebert-base',
  HuggingFaceBAAIBgeLargeZh = 'BAAI/bge-large-zh',
  HuggingFaceAnyHfEmbeddingModel = 'any-hf-embedding-model',
}
