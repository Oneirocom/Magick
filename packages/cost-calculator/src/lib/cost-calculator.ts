export enum CompletionModel {
  DAVINCI = 'davinci',
  CURIE = 'curie',
  BABBAGE = 'babbage',
  ADA = 'ada',
}

export enum EmbeddingModel {
  ADA_V2 = 'text-embedding-ada-002',
}

export type CostPerToken<T extends CompletionModel | EmbeddingModel> = {
  [key in T]: number
}

export const COST_PER_TOKEN_COMPLETION: CostPerToken<CompletionModel> = {
  [CompletionModel.ADA]: 0.0004 / 1000,
  [CompletionModel.BABBAGE]: 0.0005 / 1000,
  [CompletionModel.CURIE]: 0.002 / 1000,
  [CompletionModel.DAVINCI]: 0.02 / 1000,
}

export const COST_PER_TOKEN_EMBEDDING: CostPerToken<EmbeddingModel> = {
  [EmbeddingModel.ADA_V2]: 0.0004 / 1000,
}

export const calculateCompletionCost = ({ model, totalTokens }): number => {
  const totalCost = parseFloat(
    (totalTokens * COST_PER_TOKEN_COMPLETION[model as CompletionModel]).toFixed(
      4
    )
  )

  return totalCost
}

export const calculateEmbeddingCost = ({ model, tokens }): number => {
  const totalCost = parseFloat(
    (tokens * COST_PER_TOKEN_EMBEDDING[model as EmbeddingModel]).toFixed(4)
  )

  return totalCost
}
