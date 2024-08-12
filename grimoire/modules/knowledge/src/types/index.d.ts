import type { RAGApplicationBuilder } from '@llm-tools/embedjs'

export interface KnowledgeRuntimeConfig {}

export interface LoaderOptions {
  chunkSize?: number
  chunkOverlap?: number
}

declare module 'nitro/types' {
  interface NitroApp {
    knowledge: {
      ragApp: RAGApplicationBuilder
    }
  }
}
