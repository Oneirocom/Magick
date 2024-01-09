import { python } from 'pythonia'
import {
  CompletionRequest,
  LLMCredential,
  LLMProviders,
  LLMModels,
} from './types'
import { modelMap } from './constants'

import { CompletionResponse } from '../coreLLMService/types'
import { UserService } from '../userService/userService'
import { IBudgetManagerService } from '../types'
import { BudgetData } from 'packages/server/core/src/services/budgets/budgets.schema'

type BudgetDuration = 'daily' | 'weekly' | 'monthly' | 'yearly'

interface UserBudget {
  totalBudget: number
  duration: BudgetDuration
  createdAt: number
}

type CreateBudgetParams = {
  totalBudget: number
  agent: string
  duration: BudgetDuration
}

interface ICoreBudgetManagerService {
  createBudget(params: CreateBudgetParams): Promise<void>
  getAgentBudget(id: string): Promise<UserBudget>
  updateCost(completionObj: CompletionResponse, agent: string): Promise<void>
  resetCost(agent: string): Promise<void>
  getCurrentCost(agent: string): number
  checkUserBudget(agent: string): Promise<boolean>
  projectedCost(model: string, messages: any[], agent: string): Promise<number>
}

const BASE_URL = 'http://localhost:3030'

export class CoreBudgetManagerService implements ICoreBudgetManagerService {
  private liteLLMBudgetManager: IBudgetManagerService | undefined
  protected liteLLM: any
  protected userService: UserService
  protected credentials: LLMCredential[] = []

  constructor() {
    this.userService = new UserService()
  }
  async initialize() {
    try {
      const liteLLM = await python('litellm')
      this.liteLLM = liteLLM
      this.liteLLMBudgetManager = (await liteLLM.BudgetManager({
        client_type: 'local',
        //TODO: add base url
        api_base: 'http://localhost:3030',
      })) as IBudgetManagerService

      this.userService = new UserService()
    } catch (error: any) {
      console.error('Error initializing LiteLLM Budget Manager:', error)
      throw error
    }
  }

  async getAgentBudget(agentId: string) {
    const response = await fetch(`${BASE_URL}/budgets/${agentId}`)
    return response.json()
  }

  async createBudget({
    totalBudget,
    agent,
    duration,
  }: CreateBudgetParams): Promise<void> {
    const response = await fetch(`${BASE_URL}/budgets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        total_budget: totalBudget,
        agent_id: agent,
        duration,
      }),
    })
    return response.json()
  }

  // Method to compute the projected cost for a session
  async projectedCost(model: string, messages: any[]): Promise<number> {
    const profit = 0.2
    const baseCost = await this.liteLLMBudgetManager?.projected_cost$(
      model,
      messages,
      'magickml'
    )
    if (!baseCost) {
      throw new Error('Error getting base cost')
    }
    const totalCost = baseCost + baseCost * profit
    console.log('TOTAL COST', totalCost)
    return totalCost
  }

  // Method to update the user's cost
  async updateCost(
    completion_obj: ModelResponse,
    agent: string
  ): Promise<void> {
    // Implement logic to update the cost for a user
    // Update the user's cost based on the completion object
  }

  // Method to get the current cost of a user
  getCurrentCost(agent: string): number {
    // Implement logic to get the current cost for a user
  }

  resetCost(agent: string): Promise<void> {}

  checkUserBudget(agent: string): Promise<boolean> {
    // const currentUserFunds =
  }
}
