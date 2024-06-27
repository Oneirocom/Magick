import { OpenAIEmbeddings, OpenAI } from '@langchain/openai'
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone'
import { VectorDBQAChain } from 'langchain/chains'
import { DataType, type LLMCredential } from '@magickml/shared-services'
import {
  PRODUCTION,
  PINECONE_INDEX_NAME,
  PINECONE_API_KEY,
} from '@magickml/server-config'

type SearchArgs = {
  query: string
  numDocuments?: number
  metadata?: Record<string, any>
}

type SearchManyArgs = {
  queries: string[]
  numDocuments?: number
  metadata?: Record<string, any>
}

export interface ICoreMemoryService {
  initialize(agentId: string): Promise<void>
  addCredential(credential: LLMCredential): void
  add(
    data: string,
    options?: {
      dataType?: string
      metadata?: Record<string, any>
    }
  ): Promise<string>
  remove(memoryId: string): Promise<boolean>
  query(query: string): Promise<any>
  search(args: SearchArgs): Promise<any>
  searchMany(args: SearchManyArgs): Promise<any>
  getDataSources(): Promise<any>
}

interface EmbedchainCredential {
  serviceType: string
  name: string
  value: string
}

class CoreMemoryService implements ICoreMemoryService {
  private agentId!: string
  private pineconeIndex: any
  private credentials: EmbedchainCredential[] = []
  private useEnv: boolean = false

  constructor(useEnv?: boolean) {
    this.useEnv = useEnv || false
  }

  async initialize(agentId: string) {
    this.agentId = agentId

    if (!PINECONE_API_KEY) {
      throw new Error('Pinecone API key not found')
    }

    try {
      const pinecone = new PineconeClient({
        apiKey: PINECONE_API_KEY,
      })

      this.pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME)
    } catch (error: any) {
      console.error('Error initializing Pinecone:', error)
      throw error
    }
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

  getSupportedDataTypes(): DataType[] {
    return Object.values(DataType)
  }

  private getCredential(serviceType: string): string {
    let credential = this.credentials.find(
      c => c.serviceType === serviceType
    )?.value

    if (!credential && serviceType && (!PRODUCTION || this.useEnv)) {
      credential = process.env[serviceType]
    }

    if (!credential) {
      throw new Error(`No credential found for ${serviceType}`)
    }
    return credential
  }

  async add(
    data: string,
    {
      dataType = DataType.TEXT,
      metadata = {},
    }: { dataType?: string; metadata?: Record<string, any> } = {}
  ): Promise<string> {
    try {
      if (!this.pineconeIndex) {
        throw new Error('Pinecone index not initialized')
      }

      const docs = [
        {
          pageContent: data,
          metadata: {
            ...metadata,
            dataType,
          },
        },
      ]

      await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
        pineconeIndex: this.pineconeIndex,
        namespace: this.agentId,
        textKey: 'pageContent',
      })

      // Return a unique identifier for the added document
      return crypto.randomUUID()
    } catch (error: any) {
      console.error('Error adding to Pinecone:', error)
      throw error
    }
  }

  async remove(memoryId: string): Promise<boolean> {
    try {
      if (!this.pineconeIndex) {
        throw new Error('Pinecone index not initialized')
      }

      await this.pineconeIndex.delete1({
        ids: [memoryId],
        namespace: this.agentId,
      })

      return true
    } catch (error: any) {
      console.error('Error removing from Pinecone:', error)
      throw error
    }
  }

  async query(query: string) {
    try {
      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        {
          pineconeIndex: this.pineconeIndex,
          namespace: this.agentId,
        }
      )
      const model = new OpenAI()
      const chain = VectorDBQAChain.fromLLM(model, vectorStore)
      const response = await chain.call({ query })

      return response
    } catch (error: any) {
      console.error('Error querying Pinecone:', error)
      throw error
    }
  }

  async search({ query, numDocuments = 3, metadata = {} }: SearchArgs) {
    try {
      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        {
          pineconeIndex: this.pineconeIndex,
          namespace: this.agentId,
        }
      )

      const results = await vectorStore.similaritySearch(
        query,
        numDocuments,
        metadata
      )

      return results.map(result => ({
        context: result.pageContent,
        metadata: result.metadata,
      }))
    } catch (error: any) {
      console.error('Error searching Pinecone:', error)
      throw error
    }
  }

  async searchMany({
    queries,
    numDocuments = 3,
    metadata = {},
  }: SearchManyArgs) {
    try {
      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        {
          pineconeIndex: this.pineconeIndex,
          namespace: this.agentId,
        }
      )

      const results = await Promise.all(
        queries.map(async query => {
          const result = await vectorStore.similaritySearch(
            query,
            numDocuments,
            metadata
          )
          return result.map(item => ({
            context: item.pageContent,
            metadata: item.metadata,
          }))
        })
      )

      return results.flat()
    } catch (error: any) {
      console.error('Error searching Pinecone:', error)
      throw error
    }
  }

  async getDataSources(): Promise<any> {
    try {
      if (!this.pineconeIndex) {
        throw new Error('Pinecone index not initialized')
      }

      const response = await this.pineconeIndex.describeIndexStats({
        describeIndexStatsRequest: {
          filter: {
            namespace: this.agentId,
          },
        },
      })

      return response
    } catch (error: any) {
      console.error('Error getting data sources from Pinecone:', error)
      throw error
    }
  }
}

export { CoreMemoryService }
