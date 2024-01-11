import { python } from 'pythonia'

import { CompletionResponse } from '../coreLLMService/types'
import { UserService } from '../userService/userService'
import { IBudgetManagerService } from '../types'
import { PORTAL_URL } from 'shared/config'

type BudgetDuration = 'daily' | 'weekly' | 'monthly' | 'yearly'

type CreateBudgetParams = {
  totalBudget: number
  projectId: string
  duration: BudgetDuration
}

interface ICoreBudgetManagerService {
  createBudget(params: CreateBudgetParams): Promise<{ success: boolean }>
  updateCost(
    completionObj: CompletionResponse,
    projectId: string
  ): Promise<{ success: boolean }>
  resetCost(projectId: string): Promise<void>
  getCurrentCost(projectId: string): Promise<number>
  projectedCost({
    model,
    messages,
    projectId,
  }: {
    model: string
    messages: {
      role: string
      content: string
    }[]
    projectId: string
  }): Promise<number>
}

export class CoreBudgetManagerService implements ICoreBudgetManagerService {
  private liteLLMBudgetManager: IBudgetManagerService | undefined
  protected liteLLM: any
  protected userService: UserService

  constructor() {
    this.userService = new UserService()
  }
  async initialize() {
    try {
      const liteLLM = await python('litellm')
      this.liteLLM = liteLLM
      this.liteLLMBudgetManager = (await liteLLM.BudgetManager({
        client_type: 'local',
        api_base: PORTAL_URL,
      })) as IBudgetManagerService
    } catch (error: any) {
      console.error('Error initializing LiteLLM Budget Manager:', error)
      throw error
    }
  }

  async createBudget({
    totalBudget,
    projectId,
    duration,
  }: {
    totalBudget: number
    projectId: string
    duration: BudgetDuration
  }): Promise<{ success: boolean }> {
    // Implement logic to create a budget
    const user = await this.userService.getUser(projectId)
    await this.liteLLMBudgetManager?.create_budget$(
      totalBudget,
      user.id,
      duration
    )
    return { success: true }
  }

  // Method to compute the projected cost for a session
  async projectedCost({
    model,
    messages,
    projectId,
  }: {
    model: string
    messages: {
      role: string
      content: string
    }[]
    projectId: string
  }): Promise<number> {
    const user = await this.userService.getUser(projectId)
    const profit = 0.2
    const baseCost = await this.liteLLMBudgetManager?.projected_cost$(
      model,
      messages,
      user.id
    )

    if (!baseCost) {
      throw new Error('Error getting base cost')
    }
    const totalCost = baseCost + baseCost * profit
    console.log('TOTAL COST', totalCost)
    return totalCost as number
  }

  async getTotalBudget(projectId: string): Promise<number> {
    const user = await this.userService.getUser(projectId)
    const totalBudget = await this.liteLLMBudgetManager?.get_total_budget$(
      user.id
    )
    //TODO: Handle the data here
    console.log('TOTAL BUDGET', totalBudget, typeof totalBudget)
    return totalBudget as number
  }

  async updateCost(
    completionObj: CompletionResponse,
    projectId: string
  ): Promise<{ success: boolean }> {
    const user = await this.userService.getUser(projectId)
    await this.liteLLMBudgetManager?.update_cost$(completionObj, user.id)
    return { success: true }
  }

  async getCurrentCost(projectId: string): Promise<number> {
    const user = await this.userService.getUser(projectId)
    const currentCost = await this.liteLLMBudgetManager?.get_current_cost$(
      user.id
    )
    //TODO: Handle the data here
    console.log('CURRENT COST', currentCost, typeof currentCost)
    return currentCost as number
  }

  async getModelCost(projectId: string): Promise<number> {
    const user = await this.userService.getUser(projectId)
    const modelCost = await this.liteLLMBudgetManager?.get_model_cost$(user.id)
    //TODO: Handle the data here
    console.log('MODEL COST', modelCost, typeof modelCost)
    return modelCost as number
  }

  async isValidUser(projectId: string): Promise<boolean> {
    const user = await this.userService.getUser(projectId)
    const isValid = await this.liteLLMBudgetManager?.is_valid_user$(user.id)
    //TODO: Handle the data here
    console.log('IS VALID', isValid)
    return isValid as boolean
  }

  async getUsers(): Promise<string[]> {
    const users = await this.liteLLMBudgetManager?.get_users$()
    //TODO: Handle the data here
    console.log('USERS', users)
    return users as string[]
  }

  async resetCost(projectId: string): Promise<void> {
    const user = await this.userService.getUser(projectId)
    await this.liteLLMBudgetManager?.reset_cost$(user.id)
  }

  async resetOnDuration(projectId: string): Promise<void> {
    const user = await this.userService.getUser(projectId)
    await this.liteLLMBudgetManager?.reset_on_duration$(user.id)
  }

  async updateBudgetAllUsers(): Promise<void> {
    await this.liteLLMBudgetManager?.update_budget_all_users$()
  }

  async saveData(): Promise<void> {
    await this.liteLLMBudgetManager?.save_data$()
  }
}
