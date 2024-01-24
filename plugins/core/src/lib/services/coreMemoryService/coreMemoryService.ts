import { python } from 'pythonia'
import { PRODUCTION } from 'shared/config'
import {
  CompletionModels,
  LLMCredential,
  Models,
  OpenAIChatCompletionModels,
} from '../coreLLMService/types'

import { DataType } from './coreMemoryTypes'
import {
  EmbeddingModels,
  OpenAIEmbeddingModels,
} from '../coreEmbeddingService/types'
import {
  findProviderKey,
  findProviderName,
} from '../coreLLMService/findProvider'

export interface ICoreMemoryService {
  initialize(agentId: string): Promise<void>
  addCredential(credential: LLMCredential): void
  add(data: string, dataType?: string): Promise<any>
  query(query: string): Promise<any>
  search(query: string): Promise<any>
  searchMany(queries: string[]): Promise<any>
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

  private baseConfig: any = {
    app: {
      config: {
        id: '',
      },
    },
    vectordb: {
      provider: 'weaviate',
      config: {
        collection_name: 'embedchain',
      },
    },
    llm: {
      config: {},
    },
    embedder: {
      config: {},
    },
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

  setModel(model: CompletionModels) {
    this.setLLM(model)
  }

  private setLLM(model: CompletionModels) {
    const providerName = findProviderName(model)
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

  private setEmbedder(model: EmbeddingModels) {
    const providerName = findProviderName(model)
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

  private getCredential(model: Models): string {
    const provider = findProviderKey(model)
    let credential = this.credentials.find(
      c => c.serviceType === provider
    )?.value

    if (!credential && !PRODUCTION && provider) {
      credential = process.env[provider]
    }

    if (!credential) {
      throw new Error(`No credential found for ${provider}`)
    }
    return credential
  }

  async add(data: string, dataType: DataType) {
    const kwargs = { data_type: dataType }
    try {
      let result

      if (!this.app) this.initialize(this.agentId)

      if (dataType) {
        result = await this.app.add$(data, kwargs)
      } else {
        result = await this.app.add(data)
      }

      return result
    } catch (error: any) {
      console.error('Error adding to Embedchain:', error)
      throw error
    }
  }

  async query(query: string) {
    try {
      if (!this.app) this.initialize(this.agentId)
      const pythonResponse = await this.app.query$(query, { citations: true })
      const response = await pythonResponse.valueOf()
      return response
    } catch (error: any) {
      console.error('Error querying Embedchain:', error)
      throw error
    }
  }

  async search(query: string) {
    try {
      if (!this.app) this.initialize(this.agentId)
      const pythonResponse = await this.app._retrieve_from_database$(query, {
        citations: true,
      })
      // const responseJson = await pythonResponse.serialize()
      const response = await pythonResponse.valueOf()
      return response
    } catch (error: any) {
      console.error('Error searching Embedchain:', error)
      throw error
    }
  }

  async searchMany(queries: string[]) {
    try {
      if (!this.app) this.initialize(this.agentId)
      const responses = await Promise.all(
        queries.map(async query => await this.search(query))
      )

      return responses
    } catch (error: any) {
      console.error('Error searching Embedchain:', error)
      throw error
    }
  }

  // Placeholder for future methods that interact with the Embedchain App
}

export { CoreMemoryService }
