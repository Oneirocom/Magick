export enum CompletionModel {
  DAVINCI = 'davinci',
  CURIE = 'curie',
  BABBAGE = 'babbage',
  ADA = 'ada',
}

export enum EmbeddingModel {
  ADA_002 = 'text-embedding-ada-002',
}

export type CostPerToken<T extends CompletionModel | EmbeddingModel> = {
  [key in T]: number
}

export const COST_PER_TOKEN: CostPerToken<CompletionModel | EmbeddingModel> = {
  [CompletionModel.ADA]: 0.0004 / 1000,
  [CompletionModel.BABBAGE]: 0.0005 / 1000,
  [CompletionModel.CURIE]: 0.002 / 1000,
  [CompletionModel.DAVINCI]: 0.02 / 1000,
  [EmbeddingModel.ADA_002]: 0.0004 / 1000,
}

export const calculateCompletionCost = ({ model, totalTokens }): number => {
  const totalCost = totalTokens * COST_PER_TOKEN[model as CompletionModel]
  return totalCost
}

export const calculateEmbeddingCost = ({ model, tokens }): number => {
  const totalCost = tokens * COST_PER_TOKEN[model]
  return totalCost
}
