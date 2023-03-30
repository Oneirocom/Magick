// GENERATED 
/**
 * Represents the possible chat models
 */
export enum ChatModel {
  GPT4 = 'gpt-4',
  GPT35Turbo = 'gpt-3.5-turbo',
}

/**
 * Represents the possible text models
 */
export enum TextModel {
  DAVINCI_003 = 'text-davinci-003',
  DAVINCI_002 = 'text-davinci-002',
  DAVINCI_001 = 'text-davinci-001',
  CURIE = 'text-curie-001',
  BABBAGE = 'text-babbage-001',
  ADA = 'text-ada-001',
}

/**
 * Represents the possible embedding models
 */
export enum EmbeddingModel {
  ADA_002 = 'text-embedding-ada-002',
  ADA_001 = 'text-embedding-ada-001',
}

/**
 * Represents the cost per token for a given model
 */
export type CostPerToken<T extends TextModel | EmbeddingModel | ChatModel> = {
  [key in T]: number;
};

/**
 * The cost per token for each TextModel, EmbeddingModel and ChatModel
 */
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
};

/**
 * Calculates the cost of completing a given number of tokens
 * for a given TextModel or ChatModel
 * @param {Object} params - The parameters for the function
 * @param {TextModel|ChatModel} params.model - The model to be used
 * @param {number} params.totalTokens - The total number of tokens
 */
export const calculateCompletionCost = ({
  model,
  totalTokens,
}: {
  model: TextModel|ChatModel,
  totalTokens: number
}): number => {
  const totalCost = totalTokens * COST_PER_TOKEN[model as TextModel | ChatModel];
  return totalCost;
};

/**
 * Calculates the cost for a given number of tokens
 * for a given EmbeddingModel
 * @param {Object} params - The parameters for the function
 * @param {EmbeddingModel} params.model - The model to be used
 * @param {number} params.tokens - The number of tokens
 */
export const calculateEmbeddingCost = ({
  model,
  tokens,
}: {
  model: EmbeddingModel,
  tokens: number
}): number => {
  const totalCost = tokens * COST_PER_TOKEN[model];
  return totalCost;
};