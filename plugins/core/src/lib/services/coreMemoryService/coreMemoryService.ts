import { python } from 'pythonia'
import flatten from 'arr-flatten'
import {
  AllModels,
  CompletionModel,
  DataType,
  EmbeddingModel,
  LLMCredential,
  OpenAIChatCompletionModels,
  OpenAIEmbeddingModels,
  findProvider,
} from 'servicesShared'
import { PRODUCTION } from 'shared/config'

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
  add(data: string, dataType?: string): Promise<any>
  query(query: string): Promise<any>
  search(args: SearchArgs): Promise<any>
  searchMany(args: SearchManyArgs): Promise<any>
}

interface EmbedchainCredential {
  serviceType: string
  name: string
  value: string
}

type ModelParams = {
  temperature: number
  max_tokens: number
  top_p: number
  stream: boolean
}

const defaultParams = {
  temperature: 0.7,
  max_tokens: 100,
  top_p: 1,
  stream: false,
}

class CoreMemoryService {
  private embedchain: any
  private agentId!: string
  private app!: any
  private credentials: EmbedchainCredential[] = []
  private useEnv: boolean = false

  private baseConfig: any = {
    app: {
      config: {
        id: '',
      },
    },
    vectordb: {
      provider: 'pinecone',
      config: {
        metric: 'cosine',
        vector_dimension: 1536,
        collection_name: 'magick-dev',
        serverless_config: {
          cloud: 'aws',
          region: 'us-west-2',
        },
      },
    },
    llm: {
      config: {},
    },
    embedder: {
      config: {},
    },
  }

  constructor(useEnv?: boolean) {
    this.useEnv = useEnv || false
  }

  async initialize(agentId: string) {
    this.agentId = agentId
    try {
      // Use Pythonia to create an instance of the Embedchain App
      this.embedchain = await python('embedchain')
      // Ste initial LLM and Embedder models
      this.setLLM(OpenAIChatCompletionModels.GPT35Turbo)
      this.setEmbedder(OpenAIEmbeddingModels.TextEmbeddingAda002)

      // Set agent ID to namespace the app
      this.baseConfig.app.config.id = agentId

      this.app = await this.embedchain.App.from_config$({
        config: this.baseConfig,
      })
    } catch (error: any) {
      console.error('Error initializing Embedchain with Pythonia:', error)
      this.app = null
      throw error
    }
  }

  setModel(model: CompletionModel) {
    this.setLLM(model)
  }

  private setLLM(model: CompletionModel) {
    const providerName = findProvider(model)?.provider
    const credential = this.getCredential(model)
    const params = this.changeLLMParams()

    this.baseConfig.llm = {
      provider: providerName,
      config: {
        api_key: credential,
        model: model,
        ...params,
      },
    }
  }

  private setEmbedder(model: EmbeddingModel) {
    const providerName = findProvider(model)?.provider
    const credential = this.getCredential(model)

    this.baseConfig.embedder = {
      provider: providerName,
      config: {
        api_key: credential,
        model: model,
      },
    }
  }

  private changeLLMParams(params: Partial<ModelParams> = {}) {
    const newParams = {
      ...(this.baseConfig?.llm?.params || {}),
      ...params,
      ...defaultParams,
    }

    this.baseConfig.llm.config = newParams
    return newParams
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

  private getCredential(model: AllModels): string {
    const provider = findProvider(model)?.keyName
    let credential = this.credentials.find(
      c => c.serviceType === provider
    )?.value

    if (!credential && provider && (!PRODUCTION || this.useEnv)) {
      credential = process.env[provider]
    }

    if (!credential) {
      throw new Error(`No credential found for ${provider}`)
    }
    return credential
  }

  async add(
    data: string,
    options?: {
      dataType?: DataType
      metadata?: Record<string, any>
    }
  ) {
    const kwargs = {
      ...(options?.dataType && { data_type: options?.dataType }),
      metadata: options?.metadata || {},
    }

    try {
      if (!this.app) this.initialize(this.agentId)

      const result = await this.app.add$(data, kwargs)

      return result
    } catch (error: any) {
      console.error('Error adding to Embedchain:', error)
      throw error
    }
  }

  async remove(memoryId: string) {
    try {
      if (!this.app) this.initialize(this.agentId)
      await this.app.delete(memoryId)
      return true
    } catch (error: any) {
      console.error('Error removing from Embedchain:', error)
      throw error
    }
  }

  async query(query: string) {
    try {
      if (!this.app) await this.initialize(this.agentId)
      const pythonResponse = await this.app.query$(query, { citations: true })
      const response = await pythonResponse.valueOf()
      return response
    } catch (error: any) {
      console.error('Error querying Embedchain:', error)
      throw error
    }
  }

  async getDataSources() {
    try {
      if (!this.app) this.initialize(this.agentId)
      const pythonResponse = await this.app.get_data_sources()
      const response = await pythonResponse.valueOf()
      return response
    } catch (error: any) {
      console.error('Error getting data sources from Embedchain:', error)
      throw error
    }
  }

  async search({ query, numDocuments = 3, metadata = {} }: SearchArgs) {
    try {
      if (!this.app) this.initialize(this.agentId)

      const pythonResponse = await this.app.db.query$(query, {
        n_results: numDocuments,
        where: metadata,
        citations: true,
      })

      // const responseJson = await pythonResponse.serialize()
      const response = await pythonResponse.valueOf()

      const results = [] as { context: string; metadata: Record<string, any> }[]
      for (const result of response) {
        results.push({ context: result[0], metadata: result[1] })
      }

      return results
    } catch (error: any) {
      console.error('Error searching Embedchain:', error)
      throw error
    }
  }

  async searchMany({
    queries,
    numDocuments = 3,
    metadata = {},
  }: {
    queries: string[]
    numDocuments?: number
    metadata?: Record<string, any>
  }) {
    try {
      if (!this.app) this.initialize(this.agentId)
      const responses = await Promise.all(
        queries.map(
          async query => await this.search({ query, numDocuments, metadata })
        )
      )

      return flatten(responses)
    } catch (error: any) {
      console.error('Error searching Embedchain:', error)
      throw error
    }
  }

  // Placeholder for future methods that interact with the Embedchain App
}

export { CoreMemoryService }
