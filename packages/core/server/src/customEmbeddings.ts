import {
  CompletionProvider,
  pluginManager,
  WorkerData,
} from '@magickml/core'

import { Embeddings } from 'langchain/embeddings/base'

export type EmbeddingArgs ={
  modelName: string
  projectId: string
  secrets: string
}

/**
 * Converts the Array into chunks of the given size.
 * @param arr 
 * @param chunkSize 
 * @returns 
 */
export const chunkArray = (arr, chunkSize) =>
  arr.reduce((chunks, elem, index) => {
    const chunkIndex = Math.floor(index / chunkSize)
    const chunk = chunks[chunkIndex] || []
    chunks[chunkIndex] = chunk.concat([elem])
    return chunks
  }, [])


/**
 * A class for embedding text using a custom model.
 * This class extends the Embeddings class and provides a custom handler for embedding text.
 * @extends Embeddings
  */
export class PluginEmbeddings extends Embeddings {
  embedDocuments(): Promise<number[][]> {
    throw new Error('Please use embedDocumentsWithMeta instead.')
  }
  embedQuery(): Promise<number[]> {
    throw new Error('Please use embedQueryWithMeta instead.')
  }
  completionProviders: CompletionProvider[]
  stripNewLines: any
  modelName: string
  batchSize: number
  caller: any
  key: any
  secrets: any
  constructor(params) {
    super(params ?? {})
  }

  /**
   * Gets add models available for embedding.
   * @returns
   * @memberof PluginEmbeddings
   */
  static getModels(): string[] {
    const completionProviders = pluginManager.getCompletionProviders('text', [
      'embedding',
    ]) as CompletionProvider[]
    return completionProviders.map(provider => provider.models).flat()
  }

  /**
   * Gets the embeddings for the given text.(Single String)
   * To use when number of tokens in the text is less than 8000
   * @param {string} document
   * @param {EmbeddingArgs} param
   * @returns {Promise<number[]>}
   * @memberof PluginEmbeddings
   */
  async embedQueryWithMeta(
    document: string,
    param: EmbeddingArgs
  ): Promise<number[]> {
    const data = await this.embeddingWithRetryWithMeta(
      {
        input: [document],
      },
      param
    )
    return data.result
  }

  /**
   * Gets the embeddings for the given text.(Array of Strings)
   * To use when number of tokens in the text is more than 8000
   * @param {string[] || string} document
   * @param {EmbeddingArgs} params
   * @returns {Promise<number[][]>}
   * @memberof PluginEmbeddings
   */
  async embedDocumentsWithMeta(
    document: string[],
    params: EmbeddingArgs
  ): Promise<number[][]> {
    if (!Array.isArray(document)) {
      const wordsPerChunk = 8000
      const strLength = (document as string).length
      const output = []
      for (let i = 0; i < strLength; i += wordsPerChunk) {
        const chunk = (document as string).substring(i, i + wordsPerChunk)
        output.push(chunk)
      }
      document = output
    }
    const subPrompts = chunkArray(
      this.stripNewLines
        ? document.map(t => t.replaceAll('\n', ' '))
        : document,
      this.batchSize
    )
    const embeddings = []
    for (let i = 0; i < document.length; i += 1) {
      const input = document[i]
      const response = await this.embeddingWithRetryWithMeta(
        {
          input: input as string,
        },
        params
      )
      console.log('response', response)
      embeddings.push(response.result)
    }
    return [embeddings, document]
  }


  /**
   * Gets the embeddings using the Completion Provier, gets the model name and key through the params.
   * @param {} [projectId=DEFAULT_PROJECT_ID]
   * @param 
   * @returns {Promise<number[][]>}
   */
  async embeddingWithRetryWithMeta(embeddingObject, param: EmbeddingArgs) {
    const completionProviders = pluginManager.getCompletionProviders('text', ['embedding'])
    const provider = completionProviders.find(provider =>
      provider.models.includes(param.modelName)
    ) as CompletionProvider
    const handler = provider?.handler
    let response
    let retry = 0
    while (retry < 3) {
      try {
        response = await handler({
          inputs: { input: [{ content: embeddingObject['input'] }] },
          node: { data: { model: param.modelName } } as unknown as WorkerData,
          outputs: undefined,
          context: { module: { secrets:JSON.parse(param["secrets"]) }, projectId: param.projectId },
        })
        break
      } catch (e) {
        console.log(e)
        retry += 1
      }
    }
    return response
  }

  /**
   * Gets the embeddings for the given text.(Dummy Embeddings)
   * @param {string} words
   * @returns {Promise<number[]>}
   * @memberof PluginEmbeddings
  */
  async get_embeddings(words: string[]): Promise<number[][]> {
    return words.map(word => {
      const vec = new Array(1536).fill(0)
      vec[0] = word.length
      return vec
    })
  }
}
