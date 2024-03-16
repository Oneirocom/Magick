// memory.ts
import { LocalIndex } from 'vectra'
import { OpenAIApi, Configuration } from 'openai'
import path from 'path'
import { fileURLToPath } from 'url'
import { BaseCognitiveFunction } from '../base_cognitive_function'
import { metadataManager } from './metadata_manager'
import { Seraph } from '../seraph'

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

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
  private seraph: Seraph
  private openAIApi: OpenAIApi

  constructor(seraph: Seraph) {
    super(functionDefinition)

    const configuration = new Configuration({
      apiKey: seraph.options.openAIApiKey,
    })

    this.seraph = seraph
    this.openAIApi = new OpenAIApi(configuration)

    this.index = new LocalIndex(path.join(__dirname, '..', 'memory_index'))
  }

  getPromptInjection(): string {
    return metadataManager.getPromptInjection()
  }

  async execute(args: Record<string, any>): Promise<string> {
    const { text, type, metadata = {}, metadataDescriptions = {} } = args

    if (!(await this.index.isIndexCreated())) {
      await this.index.createIndex()
    }

    await this.index.insertItem({
      vector: await this.getVector(text),
      metadata: { text, type, ...metadata },
    })

    Object.entries(metadataDescriptions).forEach(([key, value]) => {
      metadataManager.addMetadataDescription(key, value as string)
    })

    return 'Information stored in memory'
  }

  async getVector(text: string) {
    const response = await this.openAIApi.createEmbedding({
      model: 'text-embedding-ada-002',
      input: text,
    })
    return response.data.data[0].embedding
  }
}

class MemoryRetrieval extends BaseCognitiveFunction {
  private index: LocalIndex
  private seraph: Seraph
  private openAIApi: OpenAIApi

  constructor(seraph: Seraph) {
    super({
      name: 'memoryRetrieval',
      description: 'Retrieves information from memory',
      parameters: {
        query: { type: 'string', description: 'Query to search memory' },
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
          description: 'Metadata tags and their values to filter the results',
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

    const configuration = new Configuration({
      apiKey: seraph.options.openAIApiKey,
    })

    this.seraph = seraph
    this.openAIApi = new OpenAIApi(configuration)

    this.index = new LocalIndex(path.join(__dirname, '..', 'memory_index'))
  }

  getPromptInjection(): string {
    return metadataManager.getPromptInjection()
  }

  async execute(args: Record<string, any>): Promise<string> {
    const { query, limit, type, metadata = {} } = args

    const vector = await this.getVector(query)
    const results = await this.index.queryItems(vector, limit, {
      type,
      ...metadata,
    })

    console.log('Memory results: ', results)

    if (results.length > 0) {
      const memories = results.map(result => {
        const { text, type, ...metadata } = result.item
          .metadata as MemoryMetadata
        const metadataString = Object.entries(metadata)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')
        return `Type: ${type}\nText: ${text}\nMetadata: ${metadataString}`
      })
      return `Relevant memories:\n${memories.join('\n\n')}`
    } else {
      return 'No relevant memories found.'
    }
  }

  async getVector(text: string) {
    const response = await this.openAIApi.createEmbedding({
      model: 'text-embedding-ada-002',
      input: text,
    })
    return response.data.data[0].embedding
  }
}

export { MemoryStorage, MemoryRetrieval }
