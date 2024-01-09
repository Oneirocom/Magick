export interface IBudgetManagerService {
  projected_cost$(model, messages, user): Promise<number>
}
