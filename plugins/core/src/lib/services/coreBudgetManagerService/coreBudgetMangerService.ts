import { python } from 'pythonia'

import { CompletionResponse, LLMModels, Message } from '../coreLLMService/types'
import { UserService } from '../userService/userService'
import {
  BudgetDuration,
  IBudgetManagerService,
  ICoreBudgetManagerService,
} from '../types'
import { CLOUD_AGENT_KEY, PORTAL_URL } from 'shared/config'

export class CoreBudgetManagerService implements ICoreBudgetManagerService {
  private liteLLMBudgetManager: IBudgetManagerService | undefined

  protected userService: UserService
  projectId: string

  constructor(projectId: string) {
    this.userService = new UserService()
    this.projectId = projectId
  }
  async initialize() {
    try {
      const liteLLM = await python('litellm')
      liteLLM.set_verbose = false

      const userData = await this.userService.getUser(this.projectId)
      if (!userData || !userData.user) {
        throw new Error('User data not found')
      }
      const userId = userData.user.id
      this.liteLLMBudgetManager = (await liteLLM.BudgetManager(
        this.projectId,
        'hosted',
        `${PORTAL_URL}/api/magick/budget`,
        { 'x-api-key': CLOUD_AGENT_KEY }
      )) as IBudgetManagerService
      const isValidUser = await this.isValidUser(userId)
      if (!isValidUser) {
        const initialBalance = userData.user.balance || 0
        //TODO: We need to figure out duration
        await this.createBudget({
          totalBudget: initialBalance,
          projectId: this.projectId,
          duration: BudgetDuration.yearly,
        })
      }
    } catch (error: any) {
      console.error('Error initializing LiteLLM Budget Manager:', error)
      throw error
    }
  }

  /**
   * Create a budget for a user or project
   * @param totalBudget - Total budget for the project
   * @param projectId - Project ID
   * @param duration - Duration of the budget 'daily', 'weekly', 'monthly', 'yearly'
   * @returns Promise<boolean>
   */

  async createBudget({
    totalBudget,
    projectId,
    duration,
  }: {
    totalBudget: number
    projectId: string
    duration: BudgetDuration
  }): Promise<boolean> {
    // Implement logic to create a budget
    await this.liteLLMBudgetManager?.create_budget(
      totalBudget,
      projectId,
      duration
    )
    return true
  }

  /**
   * Get the projected cost of a completion
   * @param model - Model to use for completion
   * @param messages - Messages to use for completion
   * @param projectId - Project ID
   * @returns Promise<number>
   */
  async projectedCost({
    model,
    messages,
    projectId,
  }: {
    model: string
    messages: Message[]
    projectId: string
  }): Promise<number> {
    const baseCost = await this.liteLLMBudgetManager?.projected_cost(
      model,
      messages,
      projectId
    )
    if (!baseCost) {
      throw new Error('Error getting base cost')
    }

    return baseCost
  }

  /**
   * Get the total budget for a project
   * @param projectId - Project ID
   * @returns Promise<number>
   */
  async getTotalBudget(projectId: string): Promise<number> {
    const totalBudget = await this.liteLLMBudgetManager?.get_total_budget(
      projectId
    )
    if (totalBudget === null || totalBudget === undefined) {
      throw new Error('Error getting total budget')
    }
    return totalBudget
  }

  /**
   * Update the cost of a completion. Adds an expense to the user's budget.
   * @param projectId - Project ID
   * @param completionObj - Completion response object
   * @returns Promise<boolean>
   */
  async updateCost(
    projectId: string,
    completionObj: CompletionResponse
  ): Promise<boolean> {
    await this.liteLLMBudgetManager?.update_cost(projectId, completionObj)
    return true
  }

  /**
   * Get the current cost of a project or user
   * @param projectId - Project ID
   * @returns Promise<number>
   */
  async getCurrentCost(projectId: string): Promise<number> {
    const currentCost = await this.liteLLMBudgetManager?.get_current_cost(
      projectId
    )
    if (currentCost === null || currentCost === undefined) {
      throw new Error('Error getting current cost')
    }
    return currentCost
  }

  /**
   * Get the model cost for a project or user
   * @param projectId - Project ID
   * @returns Promise<number>
   */
  async getModelCost(projectId: string): Promise<Record<LLMModels, number>> {
    const modelCost = await this.liteLLMBudgetManager?.get_model_cost(projectId)
    if (modelCost === null || modelCost === undefined) {
      throw new Error('Error getting model cost')
    }
    return modelCost
  }

  /**
   * Check if a user is valid
   * @param projectId - Project ID
   * @returns Promise<boolean>
   */
  async isValidUser(projectId: string): Promise<boolean> {
    const isValid = await this.liteLLMBudgetManager?.is_valid_user(projectId)
    if (isValid === undefined || isValid === null) {
      throw new Error('Error getting user validity')
    }
    return isValid
  }

  /**
   * Get a list of users
   * @returns Promise<string[]>
   */
  async getUsers(): Promise<string[]> {
    const users = await this.liteLLMBudgetManager?.get_users()
    if (!users) {
      throw new Error('Error getting users')
    }
    return users
  }

  /**
   * Reset the cost of a project or user
   * @param projectId - Project ID
   * @returns Promise<boolean>
   */
  async resetCost(projectId: string): Promise<boolean> {
    await this.liteLLMBudgetManager?.reset_cost(projectId)
    await this.saveData()
    return true
  }

  /**
   * Reset the cost of a project or user based on their budget duration
   * @param projectId - Project ID
   * @returns Promise<boolean>
   */
  async resetOnDuration(projectId: string): Promise<boolean> {
    await this.liteLLMBudgetManager?.reset_on_duration(projectId)
    await this.saveData()
    return true
  }

  /*
   * Usage of update_budget_all_users in BudgetManager:
   *
   * 1. Regular Budget Resets: Use for periodic resets or updates of budgets for all users,
   *    e.g., at the start of a new month or billing cycle.
   *
   * 2. Global Budget Changes: Apply changes in budget policy or allocation strategy that affect
   *    all users, like increasing budget limits due to pricing or service term changes.
   *
   * 3. Automated Maintenance: Incorporate in automated tasks for maintaining consistency in user
   *    budgets, especially after system upgrades or significant changes.
   *
   * 4. Scheduled Tasks: Utilize in scheduled jobs or cron jobs for regular updates or resets,
   *    ensuring budgets align with current policies or adjustments.
   *
   * Note:
   * - Assess the impact on users before using, as it might affect user experience or billing.
   * - Notify users of significant budget changes or resets.
   * - Test thoroughly in a controlled environment to understand its behavior and impact.
   * - Review additional documentation or source code for detailed understanding of functionality.
   */
  async updateBudgetAllUsers(): Promise<boolean> {
    await this.liteLLMBudgetManager?.update_budget_all_users()
    return true
  }

  /**
   * Save the data for the budget manager. This should be called after any changes to the budget manager.
   * @returns Promise<void>
   */
  async saveData(): Promise<boolean> {
    await this.liteLLMBudgetManager?.save_data()
    return true
  }
}
