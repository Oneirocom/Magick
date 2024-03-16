// memoryStorageMiddleware.ts
import { IndexItem, LocalIndex } from 'vectra'
import { OpenAIApi, Configuration } from 'openai'
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
  private openAIApi: OpenAIApi

  constructor(seraph: Seraph) {
    const configuration = new Configuration({
      apiKey: seraph.options.openAIApiKey,
    })

    this.seraph = seraph
    this.openAIApi = new OpenAIApi(configuration)

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

  async post(response: string, conversationId: string): Promise<void> {
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
      
      Examples:
      ${this.getExamples()}
    `

    return fullPrompt
  }

  private getExamples(): string {
    return `
      <memoryStorage>
        <text>Seraph is an AI assistant</text>
        <type>context</type>
        <metadata>
          <category>general</category>
          <timestamp>2023-06-12T10:30:00Z</timestamp>
        </metadata>
        <metadataDescriptions>
          <category>General category is for miscelanneous and broad things.</category>
          <timestamp>The timestamp of when the memory was stored</timestamp>
        </metadataDescriptions>
      </memoryStorage>
    `
  }

  async getVector(text: string) {
    const response = await this.openAIApi.createEmbedding({
      model: 'text-embedding-ada-002',
      input: text,
    })
    return response.data.data[0].embedding
  }
}

export { MemoryStorageMiddleware }
