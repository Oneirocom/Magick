import { python } from 'pythonia'
import { NODE_ENV, PRODUCTION } from 'shared/config'

import {
  // CompletionParams,
  ICoreBudgetManagerService,
  ICoreLLMService,
} from '../types'
import { CoreBudgetManagerService } from '../coreBudgetManagerService/coreBudgetMangerService'
import { UserService } from '../userService/userService'
import { saveRequest } from 'shared/core'
import { findProviderKey, findProviderName } from './findProvider'
import { LLMCredential } from './types/providerTypes'
import { CompletionResponse } from './types/completionTypes'
import { AllModels } from './types/models'

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
  protected userService: UserService

  constructor({ projectId, agentId }: ConstructorParams) {
    this.projectId = projectId
    this.agentId = agentId || ''
    this.userService = new UserService({ projectId })
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
          const user = await this.userService.getUser()
          const budgetManagerUser =
            await this.coreBudgetManagerService?.getUsers()

          const liteLLMBudget =
            await this.coreBudgetManagerService?.getTotalBudget(this.projectId)

          console.log('###PROJECT ID', this.projectId)

          console.log('USER', user, budgetManagerUser, liteLLMBudget)

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

        const body = {
          model: request.model || 'gemini-pro',
          messages: request.messages,
          ...request.options,
          stream: true,
          api_key: this.getCredential(request.model),
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
          provider: findProviderName(request.model),
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

  private getCredential = (model: AllModels): string => {
    const providerKey = findProviderKey(model)

    let credential = this.credentials.find(c => c.name === providerKey)?.value

    if (!credential && !PRODUCTION && providerKey) {
      credential = process.env[providerKey]
    }

    if (!credential) {
      throw new Error(`No credential found for ${providerKey}`)
    }
    return credential
  }

  // getProvidersWithCredentials(): LLMProviders[] {
  //   const credentialsArray = this.credentials
  //   const credentials = credentialsArray.map(cred => cred.name) as any
  //   const providers = getProvidersWithUserKeys(credentials)
  //   return providers
  // }
}
