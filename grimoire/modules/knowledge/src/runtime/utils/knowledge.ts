import type { NitroApp } from 'nitro/types'
import type { KnowledgeRuntimeConfig } from '../../types'
import { RAGApplicationBuilder } from '@llm-tools/embedjs'

export async function initKnowledgeRuntime(
  nitroApp: NitroApp,
  config: KnowledgeRuntimeConfig
) {
  if (nitroApp?.knowledge?.ragApp) {
    console.warn('Knowledge plugin already initialized')
    return
  }

  nitroApp.knowledge = {
    ragApp: new RAGApplicationBuilder(),
  }

  nitroApp.hooks.hook('close', async () => {
    // TODO: cleanup
  })
}
