import { KnexAdapter, KnexAdapterOptions } from '@feathersjs/knex'
import type { Params } from '@feathersjs/feathers'
import type { Application } from '../../declarations'
import type { Budget, BudgetData, BudgetPatch } from './budgets.schema'
import { shouldSendAlert } from './utils'

export type BudgetParams = Params<
  BudgetData & {
    newCost?: number
  }
>

export class BudgetService<
  ServiceParams extends Params = BudgetParams
> extends KnexAdapter<Budget, BudgetData, ServiceParams, BudgetPatch> {
  app: Application

  constructor(options: KnexAdapterOptions, app: Application) {
    super(options)
    this.app = app
  }

  async create(params: BudgetParams): Promise<{
    success: boolean
    data: Budget
  }> {
    const {
      agent_id,
      total_budget,
      duration,
      alert_frequency,
      alert_threshold,
      notes,
    } = params.query || {}

    if (!agent_id || !total_budget || !duration) {
      throw new Error('Missing required parameters')
    }

    const budgetData: BudgetData = {
      agent_id,
      total_budget,
      duration,
      current_cost: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      alert_frequency: alert_frequency || 'daily',
      alert_threshold: alert_threshold || 0.75,
      notes: notes || '',
    }
    const newBudget = await this._create(budgetData)

    if (!newBudget) {
      throw new Error('Error creating budget')
    }

    return {
      success: true,
      data: newBudget,
    }
  }

  async remove(agentId: string): Promise<{ success: boolean }> {
    const budget = await this._get(agentId)
    if (!budget) {
      throw new Error('Budget not found')
    }
    const deletedBudget = await this._remove(agentId)
    if (!deletedBudget) {
      throw new Error('Error deleting budget')
    }
    return {
      success: true,
    }
  }

  async get(agentId: string): Promise<Budget> {
    const budget = await this._get(agentId)
    if (!budget) {
      throw new Error('Budget not found')
    }
    return budget
  }

  async patch(
    agentId,
    params: BudgetParams
  ): Promise<{ success: boolean; data: Partial<Budget> }> {
    const budget = await this._get(agentId)
    if (!budget) {
      throw new Error('Budget not found')
    }

    const { newCost } = params.query || {}

    if (newCost) {
      const updatedCost = budget.current_cost + newCost
      if (shouldSendAlert(updatedCost, budget)) {
        //TODO: Send alert!
        console.log('Send alert!')

        await this._patch(agentId, {
          current_cost: updatedCost,
          alerted_at: new Date().toISOString(),
        })
        return {
          success: true,
          data: {
            current_cost: updatedCost,
            alerted_at: new Date().toISOString(),
          },
        }
      }
    }

    const {
      total_budget,
      duration,
      alert_frequency,
      alert_threshold,
      status,
      notes,
    } = params.query || {}

    // only update the fields that are passed in
    const budgetPatch: BudgetPatch = {
      ...(total_budget !== undefined &&
        total_budget !== null && { total_budget }),
      ...(duration !== undefined && duration !== null && { duration }),
      ...(alert_frequency !== undefined &&
        alert_frequency !== null && { alert_frequency }),
      ...(alert_threshold !== undefined &&
        alert_threshold !== null && { alert_threshold }),
      ...(status !== undefined && status !== null && { status }),
      ...(notes !== undefined && notes !== null && { notes }),
      updated_at: new Date().toISOString(),
    }
    const updatedBudget = await this._patch(agentId, budgetPatch)

    if (!updatedBudget) {
      throw new Error('Error updating budget')
    }

    return {
      success: true,
      data: updatedBudget[0],
    }
  }

  async updateCost(
    newCost: number,
    agentId: string
  ): Promise<{
    success: true
    currentCost: number
  }> {
    const currentBudget = await this._get(agentId)

    if (!currentBudget) {
      throw new Error('Budget not found')
    }

    const updatedCost = currentBudget.current_cost + newCost
    if (shouldSendAlert(updatedCost, currentBudget)) {
      //TODO: use sendgrid to send alert
      console.log('Send alert!')

      await this._patch(agentId, {
        alerted_at: new Date().toISOString(),
      })
    }

    const updatedBudget = await this._patch(agentId, {
      current_cost: updatedCost,
      updated_at: new Date().toISOString(),
    })

    if (!updatedBudget) {
      throw new Error('Error updating budget')
    }

    return {
      success: true,
      currentCost: updatedBudget.current_cost,
    }
  }

  async resetCost(agentId: string): Promise<{ success: boolean }> {
    const budgetPatch: BudgetPatch = {
      current_cost: 0,
      updated_at: new Date().toISOString(),
    }

    const updatedBudget = await this._patch(agentId, budgetPatch)

    if (!updatedBudget) {
      throw new Error('Error resetting budget')
    }

    return {
      success: true,
    }
  }

  async checkUserBudget(agentId: string): Promise<boolean> {
    const budget = await this._get(agentId)
    if (!budget) {
      throw new Error('Budget not found')
    }
    return budget.current_cost <= budget.total_budget
  }
}

/**
 * Returns options needed to initialize the BudgetsService.
 *
 * @param app - the Feathers application
 * @returns KnexAdapterOptions - options for initializing the Knex adapter
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'budgets',
    multi: ['remove'],
  }
}
