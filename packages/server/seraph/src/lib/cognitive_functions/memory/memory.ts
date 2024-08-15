// memory.ts
import { IndexItem, LocalIndex } from 'vectra'
import { OpenAI } from 'openai'
import path from 'path'
import { BaseCognitiveFunction } from '../../base_cognitive_function'
import { metadataManager } from './metadata_manager'
import { SeraphCore } from '../../seraphCore'

// import { fileURLToPath } from 'url'

//@ts-ignore
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

interface MemoryMetadata {
  text: string
  type: string
  [key: string]: any
}

const functionDefinition = {
  name: 'memoryStorage',
  description:
    'Stores information in memory. You should store as much information as you can in memory for later usage and retreival.  You can buold out your own memory types and metadata for later recall as you see fit.',
  parameters: {
    text: { type: 'string', description: 'Text to be stored in memory' },
    type: {
      type: 'string',
      description: 'Type of memory (e.g., code, context, reflection)',
    },
    metadata: {
      type: 'object',
      description: 'Additional metadata tags and their values',
    },
    metadataDescriptions: {
      type: 'object',
      description: 'Descriptions of the metadata tags',
    },
  },
  examples: [
    `<invoke>
      <tool_name>memoryStorage</tool_name>
      <parameters>
        <text>Seraph is an AI assistant</text>
        <type>context</type>
        <metadata>
          <category>general</category>
          <timestamp>2023-06-12T10:30:00Z</timestamp>
        </metadata>
        <metadataDescriptions>
          <category>The category of the memory</category>
          <timestamp>The timestamp of when the memory was stored</timestamp>
        </metadataDescriptions>
      </parameters>
    </invoke>`,
  ],
}

class MemoryStorage extends BaseCognitiveFunction {
  private index: LocalIndex
  private seraph: SeraphCore
  private openAIApi: OpenAI

  constructor(seraph: SeraphCore) {
    super(functionDefinition)

    this.seraph = seraph
    this.openAIApi = new OpenAI({
      apiKey: seraph.options.openAIApiKey,
    })

    this.index = new LocalIndex(path.join(__dirname, '.', 'memory_index'))
  }

  getPromptInjection(): Promise<string> {
    return metadataManager.getPromptInjection()
  }

  async execute(args: Record<string, any>): Promise<string> {
    const { text, type, metadata = {}, metadataDescriptions = {} } = args

    const item: IndexItem<any> = await this.index.insertItem({
      vector: await this.getVector(text),
      metadata: { text, type, ...metadata },
    })

    this.seraph.emit('info', 'Information stored in memory', item.metadata)

    Object.entries(metadataDescriptions).forEach(([key, value]) => {
      metadataManager.addMetadataDescription(key, value as string)
    })

    return 'Information stored in memory'
  }

  async getVector(text: string) {
    const response = await this.openAIApi.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })
    return response.data[0].embedding
  }
}

class MemoryRetrieval extends BaseCognitiveFunction {
  private index: LocalIndex
  private seraph: SeraphCore
  private openAIApi: OpenAI

  constructor(seraph: SeraphCore) {
    super({
      name: 'memoryRetrieval',
      description:
        'Retrieves information from memory.  Use this only when what is being talked about is out of the range of your abilities.  Be sure to also look to the conversation history. If you have trouble with your memory, ask for user input first.',
      parameters: {
        query: {
          type: 'string',
          description: 'Semantic query to search memory',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return',
        },
        type: {
          type: 'string',
          description:
            'Type of memory to retrieve (e.g., code, context, reflection)',
        },
        metadata: {
          type: 'object',
          description:
            'Metadata tags and their values to filter the results.  You can choose to just filter by metadata of you want to.',
        },
      },
      examples: [
        `<invoke>
          <tool_name>memoryRetrieval</tool_name>
          <parameters>
            <query>AI assistant</query>
            <limit>3</limit>
            <type>context</type>
            <metadata>
              <category>general</category>
            </metadata>
          </parameters>
        </invoke>`,
      ],
    })

    this.seraph = seraph
    this.openAIApi = new OpenAI({
      apiKey: seraph.options.openAIApiKey,
    })

    this.index = new LocalIndex(path.join(__dirname, '.', 'memory_index'))
  }

  async getPromptInjection(): Promise<string> {
    return metadataManager.getPromptInjection()
  }

  async execute(args: Record<string, any>): Promise<string> {
    const { query, limit, type, metadata = {} } = args

    this.seraph.emit('info', 'Retrieving memory', {
      query,
      limit,
      type,
      metadata,
    })

    const vector = await this.getVector(query)
    const results = await this.index.queryItems(vector, limit, {
      type,
      ...metadata,
    })

    if (results.length > 0) {
      const memories = results.map(result => {
        const { text, type, ...metadata } = result.item
          .metadata as MemoryMetadata
        const metadataString = Object.entries(metadata)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')
        const value = `Type: ${type}\nText: ${text}\nMetadata: ${metadataString}`
        this.seraph.emit('info', 'Memory retrieved', result.item.metadata)
        return value
      })
      const value = `Relevant memories:\n${memories.join('\n\n')}`
      this.seraph.emit('info', value)
      return value
    } else {
      this.seraph.emit('info', 'No relevant memories found.')
      return 'No relevant memories found.'
    }
  }

  async getVector(text: string) {
    const response = await this.openAIApi.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })
    return response.data[0].embedding
  }
}

export { MemoryStorage, MemoryRetrieval }
