import { python } from 'pythonia'
import { PRODUCTION, VERTEXAI_LOCATION, VERTEXAI_PROJECT } from 'shared/config'

import {
  CompletionRequest,
  LLMCredential,
  LLMProviders,
  LLMModels,
  CompletionResponse,
  Choice,
} from './types'
import { modelMap } from './constants'

type CompletionParams = {
  request: CompletionRequest
  callback: (
    chunk: Choice | null,
    isDone: boolean,
    completionResponse: CompletionResponse | null
  ) => void
  maxRetries: number
  delayMs?: number
}

interface ICoreLLMService {
  /**
   * Handles completion requests in streaming mode. Accumulates the text from each chunk and returns the complete text.
   *
   * @param request The completion request parameters.
   * @param callback A callback function that receives each chunk of text and a flag indicating if the streaming is done.
   * @returns A promise that resolves to the complete text after all chunks have been received.
   */
  completion: (params: CompletionParams) => Promise<{
    fullText: string
    completionResponse: CompletionResponse
  }>
}

export class CoreLLMService implements ICoreLLMService {
  protected liteLLM: any
  protected credentials: LLMCredential[] = []

  async initialize() {
    try {
      this.liteLLM = await python('litellm')
      this.liteLLM.vertex_project = VERTEXAI_PROJECT
      this.liteLLM.vertex_location = VERTEXAI_LOCATION
      this.liteLLM.set_verbose = false
    } catch (error: any) {
      console.error('Error initializing LiteLLM:', error)
      throw error
    }
  }

  // Method to handle completion (always in streaming mode)
  async completion({
    request,
    callback,
    maxRetries = 1,
    delayMs = 1000,
  }: CompletionParams): Promise<{
    fullText: string
    completionResponse: CompletionResponse
  }> {
    let attempts = 0
    let fullText = ''
    const chunks: any[] = []
    const messages = request.messages.filter(Boolean)

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    while (attempts < maxRetries) {
      try {
        const body = {
          model: request.model || 'gemini-pro',
          messages: request.messages,
          ...request.options,
          stream: true,
          api_key: this.getCredential(request.model),
        }

        const stream = await this.liteLLM.completion$(body)

        for await (const chunk of stream) {
          const chunkJSON = await chunk.json()
          const chunkVal = await chunkJSON.valueOf()
          chunks.push(chunkVal)

          const chunkText = await chunk.choices[0].delta.content
          fullText += chunkText
          //TODO: The full text probably needs to be passed in here
          callback(chunkVal, false, null)
        }
        // Use LiteLLM's helper method to reconstruct the completion response
        const completionResponse = await this.liteLLM.stream_chunk_builder$(
          chunks,
          { messages }
        )

        fullText += '<<END>>'
        callback(null, true, completionResponse)
        return { fullText, completionResponse }
      } catch (error: any) {
        console.error(`Attempt ${attempts + 1} failed:`, error)
        attempts++

        if (attempts >= maxRetries) {
          await sleep(delayMs)
          throw new Error(
            `Completion request failed after ${maxRetries} attempts: ${error}`
          )
        }
      }
    }

    throw new Error('Unexpected error in completion method')
  }

  addCredential(credential: LLMCredential): void {
    const existingCredentialIndex = this.credentials.findIndex(
      c => c.serviceType === credential.serviceType
    )

    if (existingCredentialIndex !== -1) {
      this.credentials[existingCredentialIndex] = credential
    } else {
      this.credentials.push(credential)
    }
  }

  private findProvider = (model: LLMModels): LLMProviders => {
    return modelMap[model]
  }

  private getCredential = (model: LLMModels): string => {
    const provider = this.findProvider(model)

    let credential = this.credentials.find(c => c.name === provider)?.value

    if (!credential && !PRODUCTION) {
      credential = process.env[provider]
    }

    if (!credential) {
      throw new Error(`No credential found for ${provider}`)
    }
    return credential
  }
}
