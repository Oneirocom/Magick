import { python } from 'pythonia'
import { PRODUCTION } from 'shared/config'

import {
  // CompletionParams,
  ICoreBudgetManagerService,
  ICoreLLMService,
} from 'servicesShared'
import { CoreBudgetManagerService } from '../coreBudgetManagerService/coreBudgetMangerService'
import { CoreUserService } from '../userService/coreUserService'
import { saveRequest } from 'shared/core'
import { SubscriptionNames } from '../userService/types'
import {
  AllModels,
  CompletionResponse,
  LLMCredential,
  findProvider,
} from 'servicesShared'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

type ConstructorParams = {
  projectId: string
  agentId?: string
}

export class CoreLLMService implements ICoreLLMService {
  protected liteLLM: any
  protected coreBudgetManagerService: ICoreBudgetManagerService | undefined
  protected credentials: LLMCredential[] = []
  protected projectId: string
  protected agentId: string
  protected userService: CoreUserService

  constructor({ projectId, agentId }: ConstructorParams) {
    this.projectId = projectId
    this.agentId = agentId || ''
    this.userService = new CoreUserService({ projectId })
  }
  async initialize() {
    try {
      this.liteLLM = await python('litellm')
      this.liteLLM.set_verbose = true
      this.liteLLM.drop_params = true
      this.coreBudgetManagerService = new CoreBudgetManagerService(
        this.projectId
      )

      await this.coreBudgetManagerService.initialize()
    } catch (error: any) {
      console.error('Error initializing LiteLLM:', error)
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
    const messages = request.messages.filter(Boolean)
    const startTime = Date.now()

    while (attempts < maxRetries) {
      try {
        if (PRODUCTION) {
          const estimatedCost =
            await this.coreBudgetManagerService?.projectedCost({
              model: request.model,
              messages: request.messages,
              projectId: this.projectId,
            })

          const totalBudget =
            await this.coreBudgetManagerService?.getTotalBudget(this.projectId)
          if (estimatedCost === undefined || totalBudget === undefined) {
            throw new Error('Invalid user')
          }

          if (estimatedCost > totalBudget) {
            throw new Error('Budget limit exceeded or invalid user')
          }
        }

        const userData = await this.userService.getUser()
        const credential = await this.getCredentialForUser({
          userData,
          model: request.model,
        })

        if (!credential) {
          throw new Error('No credential found')
        }

        const body = {
          model: request.model,
          messages: request.messages,
          ...request.options,
          stream: true,
          api_key: credential,
        }

        const stream = await this.liteLLM.completion$(body)

        for await (const chunk of stream) {
          const chunkJSON = await chunk.json()
          const chunkVal = await chunkJSON.valueOf()
          chunks.push(chunkVal)
          yield chunkVal
        }

        const completionResponsePython =
          await this.liteLLM.stream_chunk_builder$(chunks, { messages })

        if (PRODUCTION) {
          await this.coreBudgetManagerService?.updateCost(
            this.projectId,
            completionResponsePython
          )
        }

        const fullResponseJson = await completionResponsePython.json()
        const completionResponse =
          (await fullResponseJson.valueOf()) as CompletionResponse
        saveRequest({
          projectId: this.projectId,
          agentId: this.agentId,
          requestData: JSON.stringify(request.options),
          responseData: JSON.stringify(completionResponse),
          model: request.model,
          startTime: startTime,
          status: '',
          statusCode: 200,
          parameters: JSON.stringify(request.options),
          provider: findProvider(request.model)?.provider,
          type: 'completion',
          hidden: false,
          processed: false,
          totalTokens: fullResponseJson.usage.total_tokens,
          spell: spellId,
          nodeId: null,
        })
        return {
          ...completionResponse,
          _python_object: completionResponsePython,
        }
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error)
        attempts++
        if (attempts >= maxRetries) {
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
  }: {
    userData: any
    model: AllModels
  }) => {
    const providerKey = findProvider(model)?.keyName
    if (!providerKey) {
      throw new Error(`No provider key found for ${model}`)
    }
    let credential = this.credentials.find(c => c.name === providerKey)?.value
    const MAGICK_API_KEY = process.env[providerKey]
    if (userData.user.hasSubscription) {
      const userSubscriptionName = userData.user.subscriptionName.trim()
      if (userSubscriptionName === SubscriptionNames.Wizard && providerKey) {
        credential = MAGICK_API_KEY
      } else if (userSubscriptionName === SubscriptionNames.Apprentice) {
        credential = this.credentials.find(c => c.name === providerKey)?.value
      } else {
        if (userData.user.balance > 0) {
          credential = MAGICK_API_KEY
        }
      }
    }
    return credential
  }
}
