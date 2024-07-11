// import { ICredentialManager } from '../../../interfaces/credentialsManager'

import {
  streamText as originalStreamText,
  generateText,
  generateObject as originalGenerateObject,
  streamObject as originalStreamObject,
  DeepPartial,
} from 'ai'

import {
  CoreTool,
  ExtensibleLanguageModel,
  GenerateObjectRequest,
  GenerateObjectResult,
  GenerateRequest,
  StreamObjectRequest,
  StreamObjectReturn,
  StreamTextReturn,
} from '../../../../../../shared/llm-service-types/src'
import {
  ILLMService,
  LanguageModelProviderWithApiKey,
} from '../../interfaces/ILLMService'
import { KeywordsService } from '../../../../../../cloud/next/keywords/src'
import { CoreUserService } from '../../../../../../plugins/core/src'
import { createOpenAI } from '../../../../../vercel/core/src/lib/magick-openai/src'

type KeywordsModel = {
  model_name: string
  display_name: string
  max_context_window: number
  input_cost: number
  output_cost: number
  rate_limit: number
  provider: {
    provider_name: string
    provider_id: string
    api_key: string
    moderation: 'Filtered'
    extra_kwargs: any
  }
}

export default class KeywordsLLMService implements ILLMService {
  private keywords: KeywordsService
  // private credentialManager: ICredentialManager
  private providersCache?: LanguageModelProviderWithApiKey[]
  private modelCache: Record<string, ExtensibleLanguageModel[]> = {}
  private userService: CoreUserService
  private lastOutput: any

  constructor() {
    this.keywords = new KeywordsService()
    // this.credentialManager = new CredentialManager()
  }

  async getProviders(): Promise<LanguageModelProviderWithApiKey[]> {
    if (!this.providersCache) {
      const modelsGroupedByProvider = await this.keywords.fetchModels()
      this.providersCache = Object.entries(modelsGroupedByProvider).map(
        ([providerId, providerData]) => ({
          id: providerId,
          name: providerData.providerName,
          apiKey: providerData.apiKey,
        })
      )
    }
    return this.providersCache
  }

  async getModels(
    provider: string
  ): Promise<ExtensibleLanguageModel<KeywordsModel>[]> {
    if (this.modelCache[provider]) {
      return this.modelCache[
        provider
      ] as ExtensibleLanguageModel<KeywordsModel>[]
    }

    const modelsGroupedByProvider = await this.keywords.fetchModels()
    const providerData = modelsGroupedByProvider[provider]

    if (!providerData) {
      throw new Error(`Models for provider ${provider} not found`)
    }

    const models = providerData.models.map((model: KeywordsModel) => ({
      id: model.model_name,
      modelName: model.model_name,
      displayName: model.display_name,
      ...model,
    })) as ExtensibleLanguageModel<KeywordsModel>[]

    this.modelCache[provider] = models
    return models as ExtensibleLanguageModel<KeywordsModel>[]
  }

  async generateText<TOOLS extends Record<string, CoreTool>>(
    request: GenerateRequest & { tools?: TOOLS },
    extraMetadata?: Record<string, any>
  ): Promise<string> {
    const provider = extraMetadata.provider
    const apiKey = extraMetadata.apiKey
    const customerIdentifier = extraMetadata.customer_identifier

    if (!provider || !apiKey || !customerIdentifier) {
      throw new Error('Provider, apiKey, and customerIdentifier are required')
    }

    const openai = createOpenAI({
      baseURL: process.env['KEYWORDS_API_URL'],
      apiKey: process.env['KEYWORDS_API_KEY'],
      extraMetaData: {
        customer_identifier: customerIdentifier,
        customer_credentials: {
          [provider]: {
            api_key: apiKey,
          },
        },
      },
    })

    const body: Parameters<typeof originalStreamText>[0] = {
      ...request,
      model: openai.chat(request.model),
      temperature: request.temperature || undefined,
    }

    const data = await generateText(body)

    console.log({
      data,
      body,
    })

    if (!data) {
      throw new Error('No data returned')
    }

    return data.text.trim()
  }
  streamText<TOOLS extends Record<string, CoreTool>>(
    request: GenerateRequest & { tools?: TOOLS },
    extraMetadata?: Record<string, any>
  ): StreamTextReturn {
    const provider = extraMetadata.provider
    const apiKey = extraMetadata.apiKey
    const customerIdentifier = extraMetadata.customer_identifier

    if (!provider || !apiKey || !customerIdentifier) {
      throw new Error('Provider, apiKey, and customerIdentifier are required')
    }

    const openai = createOpenAI({
      baseURL: process.env['KEYWORDS_API_URL'],
      apiKey: process.env['KEYWORDS_API_KEY'],
      extraMetaData: {
        customer_identifier: customerIdentifier,
        customer_credentials: {
          [provider]: {
            api_key: apiKey,
          },
        },
      },
    })

    const body: Parameters<typeof originalStreamText>[0] = {
      ...request,
      model: openai.chat(request.model),
      temperature: request.temperature || undefined,
    }

    async function* textGenerator(): StreamTextReturn {
      const { textStream } = await originalStreamText(body)

      yield { choices: [{ delta: { content: '<START>' } }] }

      const chunks: string[] = []

      for await (const textPart of textStream) {
        chunks.push(textPart)
        yield { choices: [{ delta: { content: textPart } }] }
      }

      const chatCompletion = chunks.join('')
      return chatCompletion
    }

    return textGenerator()
  }

  async generateObject<T>(
    request: GenerateObjectRequest<T>,
    extraMetadata: Record<string, string>
  ): Promise<GenerateObjectResult<T>> {
    const provider = extraMetadata.provider
    const apiKey = extraMetadata.apiKey
    const customerIdentifier = extraMetadata.customer_identifier

    if (!provider || !apiKey || !customerIdentifier) {
      throw new Error('Provider, apiKey, and customerIdentifier are required')
    }

    const openai = createOpenAI({
      baseURL: process.env['KEYWORDS_API_URL'],
      apiKey: process.env['KEYWORDS_API_KEY'],
      extraMetaData: {
        customer_identifier: customerIdentifier,
        customer_credentials: {
          [provider]: {
            api_key: apiKey,
          },
        },
      },
    })

    const body: Parameters<typeof originalGenerateObject>[0] = {
      ...request,
      model: openai.chat(request.model),
      schema: request.schema,
      temperature: request.temperature || undefined,
    }

    const data = await originalGenerateObject(body)

    if (!data) {
      throw new Error('No data returned')
    }

    return data as GenerateObjectResult<T>
  }

  async streamObject<T>(
    request: StreamObjectRequest<T>,
    extraMetadata?: Record<string, string>
  ): Promise<StreamObjectReturn<T>> {
    const chunks: DeepPartial<T>[] = []

    const { model, schema, prompt } = request

    const provider = extraMetadata?.provider
    const apiKey = extraMetadata?.apiKey
    const customerIdentifier = extraMetadata?.customer_identifier

    if (!provider || !apiKey || !customerIdentifier) {
      throw new Error('Provider, apiKey, and customerIdentifier are required')
    }

    const openai = createOpenAI({
      baseURL: process.env['KEYWORDS_API_URL'],
      apiKey: process.env['KEYWORDS_API_KEY'],
      extraMetaData: {
        customer_identifier: customerIdentifier,
        customer_credentials: {
          [provider]: {
            api_key: apiKey,
          },
        },
      },
    })

    const body = {
      model: openai.chat(model),
      schema,
      prompt,
    }

    async function* objectGenerator(): StreamObjectReturn<T> {
      const { partialObjectStream } = await originalStreamObject(body)

      yield { choices: [{ delta: { content: '<START>' } }] }

      for await (const partialObject of partialObjectStream) {
        chunks.push(partialObject)
        yield {
          choices: [{ delta: { content: JSON.stringify(partialObject) } }],
        }
        return chunks.join('')
      }
    }

    return objectGenerator()
  }

  async generateUI(options: any) {
    return
  }

  async streamUI(options: any) {
    return
  }
}
