export enum ChatModel {
  GPT4 = 'gpt-4',
  GPT35Turbo = 'gpt-3.5-turbo',
}

export enum TextModel {
  DAVINCI_003 = 'text-davinci-003',
  DAVINCI_002 = 'text-davinci-002',
  DAVINCI_001 = 'text-davinci-001',
  CURIE = 'text-curie-001',
  BABBAGE = 'text-babbage-001',
  ADA = 'text-ada-001',
}

export enum EmbeddingModel {
  ADA_002 = 'text-embedding-ada-002',
  ADA_001 = 'text-embedding-ada-001',
}

export type CostPerToken<T extends TextModel | EmbeddingModel | ChatModel> = {
  [key in T]: number
}

export const COST_PER_TOKEN: CostPerToken<
  TextModel | EmbeddingModel | ChatModel
> = {
  [TextModel.ADA]: 0.0004 / 1000,
  [TextModel.BABBAGE]: 0.0005 / 1000,
  [TextModel.CURIE]: 0.002 / 1000,
  [TextModel.DAVINCI_003]: 0.02 / 1000,
  [TextModel.DAVINCI_002]: 0.02 / 1000,
  [TextModel.DAVINCI_001]: 0.02 / 1000,
  [ChatModel.GPT4]: 0.06 / 1000,
  [ChatModel.GPT35Turbo]: 0.002 / 1000,
  [EmbeddingModel.ADA_002]: 0.0004 / 1000,
  [EmbeddingModel.ADA_001]: 0.0004 / 1000,
}

export const calculateCompletionCost = ({ model, totalTokens }): number => {
  const totalCost = totalTokens * COST_PER_TOKEN[model as TextModel]
  return totalCost
}

export const calculateEmbeddingCost = ({ model, tokens }): number => {
  const totalCost = tokens * COST_PER_TOKEN[model]
  return totalCost
}
