import { ICoreLLMService, LLMProviderKeys } from 'servicesShared'
import { CoreUserService } from '../userService/coreUserService'
import { PortalSubscriptions } from '@magickml/portal-utils-shared'
import { LLMCredential } from 'servicesShared'
import { saveRequest } from 'server/core'
import { getLogger } from 'server/logger'
import OpenAI from 'openai'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

type ConstructorParams = {
  projectId: string
  agentId?: string
}

export class CoreLLMService implements ICoreLLMService {
  protected credentials: LLMCredential[] = []
  protected projectId: string
  protected agentId: string
  protected userService: CoreUserService
  protected openAISDK: OpenAI
  protected logger: any

  constructor({ projectId, agentId }: ConstructorParams) {
    this.projectId = projectId
    this.agentId = agentId || ''
    this.userService = new CoreUserService({ projectId })
    this.openAISDK = new OpenAI({
      baseURL: 'https://api.keywordsai.co/api/',
      apiKey: process.env['KEYWORDS_API_KEY'],
    })
  }

  async initialize() {
    try {
      this.logger = getLogger()
    } catch (error: any) {
      console.error('Error initializing CoreLLMService:', error)
      throw error
    }
  }

  async *completionGenerator({
    request,
    maxRetries = 1,
    delayMs = 1000,
    spellId,
  }) {
    let attempts = 0
    const chunks: any[] = []

    const startTime = Date.now()

    while (attempts < maxRetries) {
      try {
        const userData = await this.userService.getUser()
        const credential = await this.getCredentialForUser({
          userData,
          model: request.model,
          provider: request.provider,
        })

        if (!credential) {
          throw new Error('No credential found')
        }

        const body = {
          model: request.model.model_name,
          messages: request.messages,
          ...request.options,
          stream: true,
          extra_body: {
            customer_identifier: userData.user.id,
          },
        }

        const stream = await this.openAISDK.beta.chat.completions.stream(body)

        yield { choices: [{ delta: { content: '<START>' } }] }

        for await (const chunk of stream) {
          chunks.push(chunk)

          yield chunk as any
        }

        const chatCompletion = await stream.finalChatCompletion()

        saveRequest({
          projectId: this.projectId,
          agentId: this.agentId,
          requestData: JSON.stringify(request.options),
          responseData: JSON.stringify(chatCompletion),
          model: request.model,
          startTime: startTime,
          status: '',
          statusCode: 200,
          parameters: JSON.stringify(request.options),
          provider: request.provider,
          type: 'completion',
          hidden: false,
          processed: false,
          totalTokens: chatCompletion.usage?.total_tokens,
          spell: { id: spellId } as any,
          nodeId: null,
        })

        return chatCompletion as any
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error)
        attempts++
        if (attempts < maxRetries) {
          await sleep(delayMs)
        } else {
          throw error
        }
      }
    }

    throw new Error('Unexpected error in completion method')
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

  private getCredentialForUser = async ({
    userData,
    model,
    provider,
  }: {
    userData: any
    model: string
    provider: string
  }) => {
    const isFineTune = model.includes('ft')

    if (isFineTune) {
      return this.credentials.find(c => c.serviceType === model)?.value
    }

    const providerKey =
      LLMProviderKeys[provider as keyof typeof LLMProviderKeys]
    if (!providerKey) {
      throw new Error(`No provider key found for ${model}`)
    }
    let credential
    const MAGICK_API_KEY = process.env['KEYWORDS_API_KEY']

    if (process.env.NODE_ENV === 'development') {
      credential = MAGICK_API_KEY
    }

    if (userData.user.hasSubscription) {
      const userSubscriptionName = userData.user.subscriptionName.trim()
      if (userSubscriptionName === PortalSubscriptions.WIZARD) {
        credential = MAGICK_API_KEY
      } else if (userSubscriptionName === PortalSubscriptions.APPRENTICE) {
        credential = this.credentials.find(c => c.name === providerKey)?.value
      } else {
        if (userData.user.balance > 0 || userData.user.promoCredit > 0) {
          credential = MAGICK_API_KEY
        }
      }
    }
    return credential
  }
}
