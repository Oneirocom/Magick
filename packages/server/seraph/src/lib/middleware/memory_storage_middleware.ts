// memoryStorageMiddleware.ts
import { IndexItem, LocalIndex } from 'vectra'
import { OpenAI } from 'openai'
import path from 'path'
import { IMiddleware } from '../middlewareManager'
import { metadataManager } from '../cognitive_functions/memory'
import { SeraphCore } from '../seraphCore'
import { z } from 'zod'

// import { fileURLToPath } from 'url'

// @ts-ignore
// const __dirname = path.dirname(fileURLToPath(import.meta.url))

class MemoryStorageMiddleware implements IMiddleware {
  name = 'memoryStorage'
  private index: LocalIndex
  private seraph: SeraphCore
  private openAIApi: OpenAI

  constructor(seraph: SeraphCore) {
    this.openAIApi = new OpenAI({
      apiKey: seraph.options.openAIApiKey,
    })

    this.seraph = seraph

    console.log(
      'creating vectra store:',
      path.join(
        __dirname,
        '..',
        'cognitive_functions',
        'memory',
        'memory_index'
      )
    )

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
    if (!(await this.index.isIndexCreated())) {
      await this.index.createIndex()
    }

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
      You have the ability to store information in your memory for later retrieval.  This operation is a background process and wil not block your main cognition loop.  When storing your memory, the <text> should be the memory query which will later be used to matched to via embedding similarity to retrieve the memory.  Store the content in the metadata. Keep your text short, and remember IT IS A QUERY.

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
