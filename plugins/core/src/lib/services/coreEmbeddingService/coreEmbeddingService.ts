import { python } from 'pythonia'
import {
  EmbeddingOutput,
  GenerateEmbeddingParams,
  IEmbeddingService,
  OpenAIEmbeddingOptions,
} from 'servicesShared'

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
      switch (params.provider.toLowerCase()) {
        case 'openai':
          return this.openAIEmbeddingHandler(
            params.options as OpenAIEmbeddingOptions
          )
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
}
