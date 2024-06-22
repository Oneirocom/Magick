import { ICoreLLMService, ISharedAgent, UserResponse } from 'servicesShared'
import { CoreUserService } from '../userService/coreUserService'
import { PortalSubscriptions } from '@magickml/portal-utils-shared'
import { LLMCredential } from 'servicesShared'
import { getLogger } from 'server/logger'
import pino from 'pino'
import { streamText } from 'ai'
import { createOpenAI } from '@magickml/vercel-sdk-core'
import { clerkClient } from '@clerk/clerk-sdk-node'
import { PRODUCTION } from 'shared/config'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

type ConstructorParams = {
  projectId: string
  agentId?: string
  agent: ISharedAgent
}

export class CoreLLMService implements ICoreLLMService {
  protected credentials: LLMCredential[] = []
  protected projectId: string
  protected agentId: string
  protected agent: ISharedAgent
  protected userService: CoreUserService
  protected logger: pino.Logger<pino.LoggerOptions> | undefined
  protected userData: UserResponse | undefined

  constructor({ projectId, agentId, agent }: ConstructorParams) {
    this.agent = agent
    this.projectId = projectId
    this.agentId = agentId || ''
    this.userService = new CoreUserService({ projectId })
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
  }: {
    request: any
    maxRetries?: number
    delayMs?: number
    spellId?: string
  }) {
    let attempts = 0
    const chunks: any[] = []

    const actualMaxRetries = Math.max(1, maxRetries)

    let useWallet = this.userData?.user.useWallet
    const mpUser = this.userData?.user.mpUser
    const walletUser = this.userData?.user.walletUser

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

        const openai = createOpenAI({
          baseURL: process.env['KEYWORDS_API_URL'],
          apiKey: process.env['KEYWORDS_API_KEY'],
          extraMetaData: {
            ...(!PRODUCTION
              ? {
                  customer_identifier: useWallet
                    ? walletUser?.customer_identifier
                    : mpUser?.customer_identifier,
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
          },
        })

        const _body: Parameters<typeof streamText>[0] = {
          model: openai.chat(request.model),
          messages: request.messages,
          temperature: request.temperature || undefined,
          ...request.options,
        }

        console.log('BODY', _body)

        const { textStream } = await streamText(_body)

        yield { choices: [{ delta: { content: '<START>' } }] }

        for await (const textPart of textStream) {
          chunks.push(textPart)
          yield { choices: [{ delta: { content: textPart } }] } as any
        }

        const chatCompletion = chunks.join('')
        // const totalTokens = (await usage).totalTokens

        this.agent.saveRequest({
          projectId: this.projectId,
          agentId: this.agentId,
          requestData: JSON.stringify(request.options),
          responseData: JSON.stringify(chatCompletion),
          model: request.model,
          status: '',
          statusCode: 200,
          parameters: JSON.stringify(request.options),
          provider: request.provider,
          type: 'completion',
          cost: -0,
          hidden: false,
          processed: false,
          // totalTokens: totalTokens,
          spell: { id: spellId } as any,
          nodeId: null,
        })

        return chatCompletion as any
      } catch (error: any) {
        console.error(`Attempt ${attempts + 1} failed:`, error)

        if (
          (error?.responseBody?.includes(
            'has exceeded their budget for this period'
          ) ||
            error?.message?.includes('Payment Required')) &&
          !useWallet &&
          attempts === 0 // Only switch to wallet on the first attempt
        ) {
          const userData = await clerkClient.users.getUser(
            this.userData?.user.id || ''
          )
          await clerkClient.users.updateUserMetadata(
            this.userData?.user.id || '',
            {
              publicMetadata: {
                ...userData.publicMetadata,
                useWallet: true,
              },
            }
          )
          useWallet = true
        }
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
