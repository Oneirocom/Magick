import { ICoreLLMService, UserResponse } from 'servicesShared'
import { CoreUserService } from '../userService/coreUserService'
import { PortalSubscriptions } from '@magickml/portal-utils-shared'
import { LLMCredential } from 'servicesShared'
import { saveRequest } from 'server/core'
import { getLogger } from 'server/logger'
import OpenAI from 'openai'
import { ChatCompletionStreamParams } from 'openai/lib/ChatCompletionStream'
import pino from 'pino'
import { PRODUCTION } from 'clientConfig'

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
  protected logger: pino.Logger<pino.LoggerOptions> | undefined
  protected userData: UserResponse | undefined

  constructor({ projectId, agentId }: ConstructorParams) {
    this.projectId = projectId
    this.agentId = agentId || ''
    this.userService = new CoreUserService({ projectId })
    this.openAISDK = new OpenAI({
      baseURL: process.env['KEYWORDS_API_URL'],
      apiKey: process.env['KEYWORDS_API_KEY'],
    })
  }

  async initialize() {
    try {
      this.logger = getLogger()
      const userData = await this.userService.getUser()
      this.userData = userData
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

    const actualMaxRetries = Math.max(1, maxRetries)

    while (attempts < actualMaxRetries) {
      try {
        const userData =
          attempts > 0 && !this.userData?.user.useWallet
            ? await this.userService.getUser()
            : this.userData

        const providerApiKeyName = request.providerApiKeyName

        const credential = await this.getCredentialForUser({
          userData,
          providerApiKeyName,
          model: request.model,
        })

        const _body = {
          model: request.model,
          messages: request.messages,
          stream: true,
          ...request.options,
          ...(PRODUCTION
            ? {
                customer_identifier: userData?.user.useWallet
                  ? userData?.user.walletUser?.customer_identifier
                  : userData?.user.mpUser?.customer_identifier,
              }
            : {}),
          ...(credential
            ? {
                customer_credentials: {
                  // Assuming `request.provider` is the id field of the provider
                  [request.provider]: {
                    api_key: credential,
                  },
                },
              }
            : {}),
        }

        console.log('BODY', _body)
        // filter and remove undefined values
        const body = Object.fromEntries(
          Object.entries(_body).filter(([, v]) => v !== undefined)
        ) as ChatCompletionStreamParams

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
        if (attempts < actualMaxRetries) {
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
    providerApiKeyName,
    model,
  }: {
    userData: any
    model: string
    providerApiKeyName: string
  }) => {
    const isFineTune = model.includes('ft')

    if (isFineTune) {
      return this.credentials.find(c => c.serviceType === model)?.value
    }

    if (!providerApiKeyName) {
      throw new Error(`No provider key found for ${model}`)
    }
    let credential

    if (process.env.NODE_ENV === 'development') {
      credential = null
    }

    if (userData.user.hasSubscription) {
      const userSubscriptionName = userData.user.subscriptionName.trim()
      if (userSubscriptionName === PortalSubscriptions.WIZARD) {
        credential = null
      } else if (userSubscriptionName === PortalSubscriptions.APPRENTICE) {
        credential = this.credentials.find(
          c => c.name === providerApiKeyName
        )?.value
      } else {
        if (userData.user.balance > 0 || userData.user.promoCredit > 0) {
          credential = null
        }
      }
    }
    return credential
  }
}
