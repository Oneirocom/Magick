export interface IBudgetManagerService {
  // Creates a budget for a user
  create_budget$(
    total_budget: number,
    user: string,
    duration: 'daily' | 'weekly' | 'monthly' | 'yearly',
    created_at?: number
  ): Promise<void>
  // Computes the projected cost for a session
  projected_cost$(model: string, messages: any[], user: string): Promise<number>
  // Returns the total budget of a user
  get_total_budget$(user: string): Promise<number>
  // Updates the user's cost based on the completion object
  update_cost$(completion_obj: any, user: string): Promise<void>
  // Returns the current cost of a user
  get_current_cost$(user: string): Promise<number>
  // Returns the model cost of a user
  get_model_cost$(user: string): Promise<number>
  // Checks if a user is valid
  is_valid_user$(user: string): Promise<boolean>
  // Returns a list of all users
  get_users$(): Promise<string[]>
  // Resets the cost of a user
  reset_cost$(user: string): Promise<void>
  // Resets the cost of a user based on the duration
  reset_on_duration$(user: string): Promise<void>
  // Updates the budget for all users
  update_budget_all_users$(): Promise<void>
  // Stores the user dictionary
  save_data$(): Promise<void>
}
