import { python } from 'pythonia'
import {
  NODE_ENV,
  PRODUCTION,
  VERTEXAI_LOCATION,
  VERTEXAI_PROJECT,
} from 'shared/config'

import {
  LLMCredential,
  LLMProviders,
  LLMModels,
  CompletionResponse,
} from './types'
import { modelMap } from './constants'
import {
  CompletionParams,
  ICoreBudgetManagerService,
  ICoreLLMService,
} from '../types'
import { CoreBudgetManagerService } from '../coreBudgetManagerService/coreBudgetMangerService'
import { UserService } from '../userService/userService'
import { saveRequest } from 'shared/core'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export class CoreLLMService implements ICoreLLMService {
  protected liteLLM: any
  protected coreBudgetManagerService: ICoreBudgetManagerService | undefined
  protected credentials: LLMCredential[] = []
  protected projectId: string
  protected agentId: string
  protected userService: UserService

  constructor({ projectId, agentId }) {
    this.projectId = projectId
    this.agentId = agentId || ''
    this.userService = new UserService(projectId)
  }
  async initialize() {
    try {
      this.liteLLM = await python('litellm')
      this.liteLLM.vertex_project = VERTEXAI_PROJECT
      this.liteLLM.vertex_location = VERTEXAI_LOCATION
      this.liteLLM.set_verbose = true
      this.coreBudgetManagerService = new CoreBudgetManagerService(
        this.projectId
      )

      await this.coreBudgetManagerService.initialize()
    } catch (error: any) {
      console.error('Error initializing LiteLLM:', error)
      throw error
    }
  }

  // Method to handle completion (always in streaming mode)
  async completion({
    request,
    callback,
    maxRetries = 1,
    delayMs = 1000,
  }: CompletionParams): Promise<{
    fullText: string
    completionResponse: CompletionResponse
  }> {
    let attempts = 0
    let fullText = ''
    const chunks: any[] = []
    const messages = request.messages.filter(Boolean)

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    while (attempts < maxRetries) {
      try {
        const user = await this.userService.getUser()
        const budgetManagerUser =
          await this.coreBudgetManagerService?.getUsers()

        const liteLLMBudget =
          await this.coreBudgetManagerService?.getTotalBudget(this.projectId)
        console.log('USER', user, budgetManagerUser, liteLLMBudget)
        // console.log('BUDGET USER', budgetUser, budgetUser?.length)
        const estimatedCost =
          await this.coreBudgetManagerService?.projectedCost({
            model: request.model,
            messages: request.messages,
            projectId: this.projectId,
          })

        const totalBudget = await this.coreBudgetManagerService?.getTotalBudget(
          this.projectId
        )
        if (estimatedCost === undefined || totalBudget === undefined) {
          throw new Error('Invalid user')
        }

        if (estimatedCost > totalBudget) {
          throw new Error('Budget limit exceeded')
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

          const chunkText = chunkVal.choices[0].delta.content
          fullText += chunkText
          callback(chunkVal, false, null)
        }
        // Use LiteLLM's helper method to reconstruct the completion response
        const python_response = await this.liteLLM.stream_chunk_builder$(
          chunks,
          { messages }
        )

        const compRes = await python_response.json()
        const compResVal = await compRes.valueOf()
        const completionResponse = {
          ...compResVal,
          _python_object: python_response,
        }
        callback(null, true, completionResponse)
        return { fullText, completionResponse: completionResponse }
      } catch (error: any) {
        console.error(`Attempt ${attempts + 1} failed:`, error)
        attempts++

        if (attempts >= maxRetries) {
          await sleep(delayMs)
          throw new Error(
            `Completion request failed after ${maxRetries} attempts: ${error}`
          )
        }
      }
    }

    throw new Error('Unexpected error in completion method')
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
        if (NODE_ENV !== 'development') {
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

        if (NODE_ENV !== 'development') {
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
          provider: this.findProvider(request.model),
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

  private findProvider = (model: LLMModels): LLMProviders => {
    return modelMap[model]
  }

  private getCredential = (model: LLMModels): string => {
    const provider = this.findProvider(model)

    let credential = this.credentials.find(c => c.name === provider)?.value

    if (!credential && !PRODUCTION) {
      credential = process.env[provider]
    }

    if (!credential) {
      throw new Error(`No credential found for ${provider}`)
    }
    return credential
  }
}
