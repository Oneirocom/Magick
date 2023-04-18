import {
  CompletionProvider,
  DEFAULT_PROJECT_ID,
  pluginManager,
  WorkerData,
} from '@magickml/core'

import import_ from '@brillout/import'
import { toUpper } from 'lodash'
const EmbeddingsPro = import_('langchain/embeddings')
const { Embeddings } = await EmbeddingsPro
export const chunkArray = (arr, chunkSize) =>
  arr.reduce((chunks, elem, index) => {
    const chunkIndex = Math.floor(index / chunkSize)
    const chunk = chunks[chunkIndex] || []
    // eslint-disable-next-line no-param-reassign
    chunks[chunkIndex] = chunk.concat([elem])
    return chunks
  }, [])

export class PluginEmbeddings extends Embeddings {
  handler: CompletionProvider['handler']
  stripNewLines: any
  modelName: string
  batchSize: number
  caller: any
  key: any
  constructor(params) {
    super(params ?? {})
    this.key = {}
    const [completionProviders, secrets] =
      pluginManager.getCompletionProvidersWithSecrets('text', ['embedding'])
    this.modelName =
      params.model ||
      (completionProviders.length > 0 && completionProviders[0].models[0])
    this.batchSize = params.batchSize ?? 64
    // Get the provider for the selected model.
    if (secrets.length > 0) {
      secrets[0].forEach(secret => {
        this.key[secret.key] = process.env[toUpper(secret.key)]
      })
    }
    const provider = completionProviders.find(provider =>
      provider.models.includes(this.modelName)
    ) as CompletionProvider
    this.stripNewLines = false

    if(!provider) {
        console.error(`No completion provider found for model ${this.modelName}`)
    }

    //Set the handler
    this.handler = provider?.handler
  }

  static getModels(): string[] {
    const completionProviders = pluginManager.getCompletionProviders('text', [
      'embedding',
    ]) as CompletionProvider[]
    return completionProviders.map(provider => provider.models).flat()
  }

  async embedQuery(
    document: string,
    projectId = DEFAULT_PROJECT_ID
  ): Promise<number[]> {
    const data = await this.embeddingWithRetry(
      {
        model: this.modelName,
        input: [document],
      },
      projectId
    )
    return data.result
  }
  async embedDocuments(
    document: string[],
    projectId = DEFAULT_PROJECT_ID
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
    console.log(document)
    const subPrompts = chunkArray(
      this.stripNewLines
        ? document.map(t => t.replaceAll('\n', ' '))
        : document,
      this.batchSize
    )
    const embeddings = []
    for (let i = 0; i < document.length; i += 1) {
      const input = document[i]
      const response = await this.embeddingWithRetry(
        {
          input: input as string,
        },
        projectId
      )
      console.log('response', response)
      embeddings.push(response.result)
    }
    return [embeddings, document]
  }
  async embeddingWithRetry(embeddingObject, projectId) {
    let response
    let retry = 0
    while (retry < 3) {
      try {
        console.log('retrying')
        response = await this.handler({
          inputs: { input: [{ content: embeddingObject['input'] }] },
          node: { data: { model: this.modelName } } as unknown as WorkerData,
          outputs: undefined,
          context: { module: { secrets: this.key }, projectId: projectId },
        })
        break
      } catch (e) {
        console.log(e)
        retry += 1
      }
    }
    return response
  }
  async get_embeddings(words: string[]): Promise<number[][]> {
    return words.map(word => {
      const vec = new Array(1536).fill(0)
      vec[0] = word.length
      return vec
    })
  }
  splitText(blob): string[] {
    // Split the blob into individual tokens
    const tokens = blob.split(/\s+/)

    // Initialize an array to hold the smaller blobs
    const blobs = []

    // Initialize a variable to hold the current blob
    let currentBlob = ''

    // Loop through each token
    for (const token of tokens) {
      // If adding the current token would push the current blob over 8000 tokens,
      // add the current blob to the array of blobs and start a new blob
      if (currentBlob.length + token.length + 1 > 5000) {
        blobs.push(currentBlob)
        currentBlob = ''
      }

      // Add the current token to the current blob, separated by a space
      currentBlob += token + ' '
    }

    // If there is any remaining text in the current blob, add it to the array of blobs
    if (currentBlob.length > 0) {
      blobs.push(currentBlob.trim())
    }

    return blobs
  }
}
