import { CompletionProvider, pluginManager, WorkerData } from 'shared/core'

import { Embeddings } from 'langchain/embeddings/base'

export type EmbeddingArgs = {
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
  stripNewLines: any
  declare caller: any
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
        input: document,
      },
      param
    )
    return data.result
  }

  //TODO: Remove tis function at some point, we are doing this chunking elsewhere in the code
  /**
   * Gets the embeddings for the given text.(Array of Strings)
   * To use when number of tokens in the text is more than 8000
   * @param {string[] || string} document
   * @param {EmbeddingArgs} params
   * @returns {Promise<number[][]>}
   * @memberof PluginEmbeddings
   */
  async embedDocumentsWithMeta(document, params) {
    if (!Array.isArray(document)) {
      const wordsPerChunk = 8000
      const str = document as string
      const chunks = str.split('<<BREAK>>')
      const output = [] as string[][]
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        const chunkLength = this.countWords(chunk)
        const subChunks = [] as string[]
        for (let j = 0; j < chunkLength; j += wordsPerChunk) {
          const subChunk = chunk.substring(j, j + wordsPerChunk)
          subChunks.push(subChunk)
        }
        output.push(subChunks)
      }
      document = output.flat()
    }

    const embeddings = [] as any
    for (let i = 0; i < document.length; i++) {
      const input = document[i]
      const response = await this.embeddingWithRetryWithMeta(
        { input: input as string },
        params
      )
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
    // console.log(param)
    const completionProviders = pluginManager.getCompletionProviders('text', [
      'embedding',
    ])
    const provider = completionProviders.find(provider =>
      provider.models.includes(param.modelName)
    ) as CompletionProvider
    const handler = provider?.handler

    if (!handler) {
      throw new Error(
        `No handler found for model ${param.modelName} in plugin ${provider?.pluginName}`
      )
    }

    let response: any
    let retry = 0
    while (retry < 3) {
      try {
        response = await handler({
          inputs: { input: [embeddingObject['input']] },
          node: { data: { model: param.modelName } } as unknown as WorkerData,
          outputs: {},
          context: {
            module: { secrets: JSON.parse(param['secrets']) },
            projectId: param.projectId,
          },
        })
        console.log(response.error)
        break
      } catch (e) {
        console.error(e)
        retry += 1
      }
    }
    return response
  }

  countWords(str) {
    return str.trim().split(/\s+/).length
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
