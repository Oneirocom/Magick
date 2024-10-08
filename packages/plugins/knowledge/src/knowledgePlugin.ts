import { generateToken } from '@magickml/embedder-auth-token'
import { makeEmbedderClient } from '@magickml/embedder-client-ts'
import { BasePlugin, createSimplePluginClass } from '@magickml/agent-plugin'
import { CORE_DEP_KEYS } from '@magickml/shared-services'
import { getContext } from './nodes/context'
import {
  createPack,
  deletePack,
  getChunks,
  getManyPacks,
  getPack,
} from './nodes'
import { queryPack } from './nodes/query'
import { sourceNodes } from './nodes/source'
import { waitForEmbedderJob } from './nodes/waitForEmbedderJob'

export const KnowledgePlugin = createSimplePluginClass({
  name: 'knowledge',
  nodes: [
    getContext,
    createPack,
    deletePack,
    getManyPacks,
    getPack,
    getChunks,
    queryPack,
    ...sourceNodes,
    waitForEmbedderJob,
  ],
  values: [],
  provideDependencies: function (plugin: BasePlugin) {
    const apiKey = process.env.AGENT_EMBEDDER_API_KEY
    return {
      [CORE_DEP_KEYS.EMBEDDER_CLIENT]: makeEmbedderClient(
        apiKey ||
          generateToken({
            owner: plugin.projectId,
            entity: plugin.projectId,
          })
      ),
    }
  },
})
