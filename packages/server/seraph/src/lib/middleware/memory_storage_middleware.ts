// memoryStorageMiddleware.ts
import { IndexItem, LocalIndex } from 'vectra'
import { OpenAI } from 'openai'
import path from 'path'
import { fileURLToPath } from 'url'
import { IMiddleware } from '../middlewareManager'
import { metadataManager } from '../cognitive_functions/memory'
import { Seraph } from '../seraph'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class MemoryStorageMiddleware implements IMiddleware {
  name = 'memoryStorage'
  private index: LocalIndex
  private seraph: Seraph
  private openAIApi: OpenAI

  constructor(seraph: Seraph) {
    this.openAIApi = new OpenAI({
      apiKey: seraph.options.openAIApiKey,
    })

    this.seraph = seraph

    this.index = new LocalIndex(
      path.join(
        __dirname,
        '..',
        'cognitive_functions',
        'memory',
        'memory_index'
      )
    )
  }

  schema = z.object({
    text: z.string(),
    type: z.string(),
    metadata: z.record(z.any()).optional(),
    metadataDescriptions: z.record(z.string()).optional(),
  })

  async run(response: string, conversationId: string): Promise<string> {
    const parsedResponse = JSON.parse(response)
    const {
      text,
      type,
      metadata = {},
      metadataDescriptions = {},
    } = parsedResponse

    const item: IndexItem<any> = await this.index.insertItem({
      vector: await this.getVector(text),
      metadata: { text, type, conversationId, ...metadata },
    })

    this.seraph.emit('info', 'Information stored in memory', item.metadata)

    Object.entries(metadataDescriptions).forEach(([key, value]) => {
      metadataManager.addMetadataDescription(key, value as string)
    })

    return `Stored memory ${type} with content "${text}" and metadata ${JSON.stringify(
      item.metadata
    )}`
  }

  async getPrompt(): Promise<string> {
    const basePrompt = `
      You have the ability to store information in your memory for later retrieval.  This operation is a background process and wil not block your main cognition loop.

      The <metadata> and <metadataDescriptions> tags are optional. If you create a new metadata tag, use a proper description to describe what it does.
    `

    const metadataPrompt = await metadataManager.getPromptInjection()
    const fullPrompt = `
      ${basePrompt}
      
      ${metadataPrompt}
    `

    return fullPrompt
  }

  async getVector(text: string) {
    const response = await this.openAIApi.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })
    return response.data[0].embedding
  }
}

export { MemoryStorageMiddleware }
