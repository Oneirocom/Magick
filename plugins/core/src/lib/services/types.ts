import {
  Chunk,
  CompletionRequest,
  CompletionResponse,
  LLMModels,
  Message,
} from './coreLLMService/types'

export interface IBudgetManagerService {
  // Creates a budget for a user
  create_budget(
    total_budget: number,
    user: string,
    duration: 'daily' | 'weekly' | 'monthly' | 'yearly',
    created_at?: number
  ): Promise<void>
  // Computes the projected cost for a session
  projected_cost(model: string, messages: any[], user: string): Promise<number>
  // Returns the total budget of a user
  get_total_budget(user: string): Promise<number>
  // Updates the user's cost based on the completion object
  update_cost(user: string, completion_obj: any): Promise<void>
  // Returns the current cost of a user
  get_current_cost(user: string): Promise<number>
  // Returns the model cost of a user
  get_model_cost(user: string): Promise<Record<LLMModels, number>>
  // Checks if a user is valid
  is_valid_user(user: string): Promise<boolean>
  // Returns a list of all users
  get_users(): Promise<string[]>
  // Resets the cost of a user
  reset_cost(user: string): Promise<void>
  // Resets the cost of a user based on the duration
  reset_on_duration(user: string): Promise<void>
  // Updates the budget for all users
  update_budget_all_users(): Promise<void>
  // Stores the user dictionary
  save_data(): Promise<void>
}

export enum BudgetDuration {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
}

export type CreateBudgetParams = {
  totalBudget: number
  projectId: string
  duration: BudgetDuration
}

export interface ICoreBudgetManagerService {
  initialize(): Promise<void>
  createBudget(params: CreateBudgetParams): Promise<boolean>
  projectedCost({
    model,
    messages,
    projectId,
  }: {
    model: string
    messages: Message[]
    projectId: string
  }): Promise<number>
  getTotalBudget(projectId: string): Promise<number>
  updateCost(
    projectId: string,
    completionObj: CompletionResponse
  ): Promise<boolean>
  getCurrentCost(projectId: string): Promise<number>
  getModelCost(projectId: string): Promise<Record<LLMModels, number>>
  isValidUser(projectId: string): Promise<boolean>
  getUsers(): Promise<string[]>
  resetCost(projectId: string): Promise<boolean>
  resetOnDuration(projectId: string): Promise<boolean>
  updateBudgetAllUsers(): Promise<boolean>
  saveData(): Promise<boolean>
}

export type CompletionParams = {
  request: CompletionRequest
  callback: (
    chunk: Chunk | null,
    isDone: boolean,
    completionResponse: CompletionResponse | null
  ) => void
  maxRetries: number
  delayMs?: number
}

export interface ICoreLLMService {
  /**
   * Handles completion requests in streaming mode. Accumulates the text from each chunk and returns the complete text.
   *
   * @param request The completion request parameters.
   * @param callback A callback function that receives each chunk of text and a flag indicating if the streaming is done.
   * @returns A promise that resolves to the complete text after all chunks have been received.
   */
  completion: (params: CompletionParams) => Promise<{
    fullText: string
    completionResponse: CompletionResponse
  }>
  initialize: () => Promise<void>
}
