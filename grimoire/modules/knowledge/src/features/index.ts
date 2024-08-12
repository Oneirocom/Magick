export const knowledgeFeatures = {
  loaders: 'knowledge/loaders',
  files: 'knowledge/files',
} as const

export type KnowledgeFeatures = typeof knowledgeFeatures
