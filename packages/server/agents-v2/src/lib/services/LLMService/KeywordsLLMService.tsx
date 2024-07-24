import {
  streamText as originalStreamText,
  generateText,
  generateObject as originalGenerateObject,
  streamObject as originalStreamObject,
  DeepPartial,
} from 'ai'

import {
  ILLMService,
  ExtensibleLanguageModelProvider,
} from '../../interfaces/ILLMService'
import { KeywordsService } from '@magickml/keywords-service'
import { createOpenAI } from '@magickml/vercel-sdk-core'
import {
  CoreTool,
  ExtensibleLanguageModel,
  GenerateObjectRequest,
  GenerateObjectResult,
  GenerateRequest,
  StreamObjectRequest,
  StreamObjectResult,
  StreamObjectReturn,
  StreamObjectYield,
  StreamTextReturn,
} from '@magickml/llm-service-types'

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

export class KeywordsLLMService implements ILLMService {
  private keywords: KeywordsService
  private providersCache?: ExtensibleLanguageModelProvider<{ apiKey: string }>[]
  private modelCache: Record<string, ExtensibleLanguageModel[]> = {}

  constructor() {
    this.keywords = new KeywordsService()
  }

  async getProviders<T extends Record<string, unknown> = {}>(): Promise<
    ExtensibleLanguageModelProvider<T & { apiKey: string }>[]
  > {
    if (!this.providersCache) {
      const modelsGroupedByProvider = await this.keywords.fetchModels()
      this.providersCache = Object.entries(modelsGroupedByProvider).map(
        ([providerId, providerData]) => ({
          id: providerId,
          name: providerData.providerName,
          apiKey: providerData.apiKey,
        })
      ) as ExtensibleLanguageModelProvider<T & { apiKey: string }>[]
    }
    return this.providersCache as ExtensibleLanguageModelProvider<
      T & { apiKey: string }
    >[]
  }

  async getModels<T extends Record<string, unknown> = {}>(
    provider: string
  ): Promise<ExtensibleLanguageModel<T & KeywordsModel>[]> {
    if (this.modelCache[provider]) {
      return this.modelCache[provider] as ExtensibleLanguageModel<
        T & KeywordsModel
      >[]
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
    })) as ExtensibleLanguageModel<T & KeywordsModel>[]

    this.modelCache[provider] = models
    return models as ExtensibleLanguageModel<T & KeywordsModel>[]
  }

  async generateText<TOOLS extends Record<string, CoreTool>>(
    request: GenerateRequest & { tools?: TOOLS },
    extraMetadata?: Record<string, any>
  ): Promise<string> {
    const provider = extraMetadata?.provider
    // const apiKey = extraMetadata?.apiKey
    const customerIdentifier = extraMetadata?.customer_identifier

    if (!provider || !customerIdentifier) {
      throw new Error('Provider, apiKey, and customerIdentifier are required')
    }
    const openai = createOpenAI({
      baseURL: process.env['KEYWORDS_API_URL'],
      apiKey: process.env['KEYWORDS_API_KEY'],
      extraMetaData: {
        customer_identifier: customerIdentifier,
        // customer_credentials: {
        //   [provider]: {
        //     api_key: apiKey,
        //   },
        // },
      },
    })

    const body: Parameters<typeof originalStreamText>[0] = {
      ...request,
      model: openai.chat(request.model),
      temperature: request.temperature || undefined,
    }

    const data = await generateText(body)

    if (!data) {
      throw new Error('No data returned')
    }

    return data.text.trim()
  }

  streamText<TOOLS extends Record<string, CoreTool>>(
    request: GenerateRequest & { tools?: TOOLS },
    extraMetadata?: Record<string, any>
  ): StreamTextReturn {
    const provider = extraMetadata?.provider
    // const apiKey = extraMetadata?.apiKey
    const customerIdentifier = extraMetadata?.customer_identifier

    if (!provider || !customerIdentifier) {
      throw new Error('Provider, apiKey, and customerIdentifier are required')
    }

    const openai = createOpenAI({
      baseURL: 'https://api.keywordsai.co',
      apiKey: 'QnVif7uB.zeRJatZvTRWe9yABP8nx4ZCeuJuTsxQ3',
      extraMetaData: {
        customer_identifier: customerIdentifier,
        // customer_credentials: {
        //   [provider]: {
        //     api_key: apiKey,
        //   },
        // },
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
        // customer_credentials: {
        //   [provider]: {
        //     api_key: apiKey,
        //   },
        // },
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
    extraMetadata?: Record<string, unknown>
  ): Promise<StreamObjectReturn<T>> {
    const { model, schema, prompt } = request

    const provider = extraMetadata?.provider as string
    const apiKey = extraMetadata?.apiKey as string
    const customerIdentifier = extraMetadata?.customer_identifier as string

    if (!provider || !apiKey || !customerIdentifier) {
      throw new Error('Provider, apiKey, and customerIdentifier are required')
    }

    const openai = createOpenAI({
      baseURL: process.env['KEYWORDS_API_URL'],
      apiKey: process.env['KEYWORDS_API_KEY'],
      extraMetaData: {
        customer_identifier: customerIdentifier,
        // customer_credentials: {
        //   [provider]: {
        //     api_key: apiKey,
        //   },
        // },
      },
    })

    const body = {
      model: openai(model),
      schema,
      prompt,
    }

    const { partialObjectStream, object: finalObjectPromise } =
      await originalStreamObject(body)

    async function* objectGenerator(): AsyncGenerator<
      StreamObjectYield<T>,
      StreamObjectResult<T>,
      unknown
    > {
      for await (const partialObject of partialObjectStream) {
        yield {
          choices: [{ delta: { content: partialObject as DeepPartial<T> } }],
        }
      }

      // Await and return the final result
      const finalObject = await finalObjectPromise
      return {
        object: finalObject,
        finishReason: 'stop',
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      } as StreamObjectResult<T>
    }

    return objectGenerator()
  }
}
