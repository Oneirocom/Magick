import { python } from 'pythonia'
import {
  AzureEmbeddingOptions,
  BedrockEmbeddingOptions,
  CohereEmbeddingOptions,
  CustomOpenAIEmbeddingOptions,
  EmbeddingOutput,
  GenerateEmbeddingParams,
  HuggingFaceEmbeddingOptions,
  IEmbeddingService,
  MistralEmbeddingOptions,
  OpenAIEmbeddingOptions,
  VoyageEmbeddingOptions,
} from './types'
import { LLMProviders } from '../coreLLMService/types'

export class EmbeddingService implements IEmbeddingService {
  protected liteLLM: any

  async initialize() {
    try {
      this.liteLLM = await python('litellm')
      this.liteLLM.set_verbose = true // Set to false in production
    } catch (error: any) {
      console.error('Error initializing LiteLLM for EmbeddingService:', error)
      throw error
    }
  }

  /**
   *
   * @param model: string - ID of the model to use. model='text-embedding-ada-002'
   * @param input: array - Input text to embed, encoded as a string or array of tokens.
   * To embed multiple inputs in a single request, pass an array of strings or array of token arrays.
   * The input must not exceed the max input tokens for the model (8192 tokens for text-embedding-ada-002),
   * cannot be an empty string, and any array must be 2048 dimensions or less.
   */
  // Agent embedding model
  async generateEmbedding(
    params: GenerateEmbeddingParams
  ): Promise<EmbeddingOutput> {
    try {
      switch (params.provider) {
        case LLMProviders.OpenAI:
          return this.openAIEmbeddingHandler(params.options)
        case LLMProviders.Azure:
          return this.azureEmbeddingHandler(params.options)
        case LLMProviders.CustomOpenAI:
          return this.customOpenAIEmbeddingHandler(params.options)
        case LLMProviders.Bedrock:
          return this.bedrockEmbeddingHandler(params.options)
        case LLMProviders.Cohere:
          return this.cohereEmbeddingHandler(params.options)
        case LLMProviders.HuggingFace:
          return this.huggingFaceEmbeddingHandler(params.options)
        case LLMProviders.Mistral:
          return this.mistralEmbeddingHandler(params.options)
        case LLMProviders.VoyageAI:
          return this.voyageEmbeddingHandler(params.options)
        // ... other cases ...
        default:
          throw new Error('Unsupported embedding options')
      }
    } catch (error: any) {
      console.error('Error generating embedding:', error)
      throw error
    }
  }

  openAIEmbeddingHandler = async ({
    input,
    model,
  }: OpenAIEmbeddingOptions): Promise<EmbeddingOutput> => {
    // Add additional logic if needed for handling input, model, and options
    try {
      const response = await this.liteLLM.embedding({
        model,
        input,
      })

      if (!response || !response.data) {
        throw new Error('Error during embedding generation')
      }
      return response
    } catch (error: any) {
      console.error('Error generating embedding:', error)
      throw error
    }
  }

  customOpenAIEmbeddingHandler = async ({
    input,
    model,
  }: CustomOpenAIEmbeddingOptions): Promise<EmbeddingOutput> => {
    try {
      const response = await this.liteLLM.embedding({
        model,
        input,
      })

      if (!response || !response.data) {
        throw new Error('Error during embedding generation')
      }
      return response
    } catch (error: any) {
      console.error('Error generating embedding:', error)
      throw error
    }
  }

  azureEmbeddingHandler = async ({
    model,
    input,
    api_key,
    api_base,
    api_version,
  }: AzureEmbeddingOptions): Promise<EmbeddingOutput> => {
    try {
      const response = await this.liteLLM.embedding({
        model,
        input,
        api_key,
        api_base,
        api_version,
      })
      return response
    } catch (error: any) {
      console.error('Error generating Azure embedding:', error)
      throw error
    }
  }

  bedrockEmbeddingHandler = async ({
    models,
    input,
    aws_access_key_id,
    aws_secret_access_key,
    aws_region_name,
  }: BedrockEmbeddingOptions): Promise<EmbeddingOutput> => {
    try {
      const response = await this.liteLLM.embedding({
        model: models,
        input,
        aws_access_key_id,
        aws_secret_access_key,
        aws_region_name,
      })
      return response
    } catch (error: any) {
      console.error('Error generating Bedrock embedding:', error)
      throw error
    }
  }

  cohereEmbeddingHandler = async ({
    model,
    input,
    input_type,
  }: CohereEmbeddingOptions): Promise<EmbeddingOutput> => {
    try {
      const response = await this.liteLLM.embedding({
        model,
        input,
        input_type,
      })
      return response
    } catch (error: any) {
      console.error('Error generating Cohere embedding:', error)
      throw error
    }
  }

  huggingFaceEmbeddingHandler = async ({
    model,
    input,
    api_base,
  }: HuggingFaceEmbeddingOptions): Promise<EmbeddingOutput> => {
    try {
      const response = await this.liteLLM.embedding({
        model,
        input,
        api_base,
      })
      return response
    } catch (error: any) {
      console.error('Error generating HuggingFace embedding:', error)
      throw error
    }
  }
  mistralEmbeddingHandler = async ({
    model,
    input,
  }: MistralEmbeddingOptions): Promise<EmbeddingOutput> => {
    try {
      const response = await this.liteLLM.embedding({
        model,
        input,
      })
      return response
    } catch (error: any) {
      console.error('Error generating Mistral AI embedding:', error)
      throw error
    }
  }

  voyageEmbeddingHandler = async ({
    model,
    input,
  }: VoyageEmbeddingOptions): Promise<EmbeddingOutput> => {
    try {
      const response = await this.liteLLM.embedding({
        model,
        input,
      })
      return response
    } catch (error: any) {
      console.error('Error generating Voyage embedding:', error)
      throw error
    }
  }
}
