import {
  ILogger,
  NodeCategory,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'
import { MemoryStreamService } from '../../services/memoryStreamService'
import { CORE_DEP_KEYS } from '@magickml/shared-services'

export const addMemory = makeFlowNodeDefinition({
  typeName: 'action/memory/addMemory',
  category: NodeCategory.Action,
  label: 'Add Memory',
  in: {
    flow: 'flow',
    content: 'string',
    role: {
      label: 'Role',
      choices: ['user', 'assistant'],
      defaultValue: 'assistant',
      valueType: 'string',
    },
    type: {
      label: 'Type',
      optional: true,
      defaultValue: undefined,
      valueType: 'string',
    },
  },
  out: {
    flow: 'flow',
    memory: 'object',
    message: 'object',
  },
  initialState: undefined,
  triggered: async ({ commit, read, write, graph }) => {
    const { getDependency } = graph
    const memoryService = getDependency<MemoryStreamService>(
      CORE_DEP_KEYS.MEMORY_STREAM_SERVICE
    )

    const logger = getDependency<ILogger>(CORE_DEP_KEYS.LOGGER)

    if (!memoryService) {
      throw new Error('Memory service not found')
    }

    if (!logger) {
      throw new Error('Logger not found')
    }

    const content = read('content') as string
    const role = read('role') as 'user' | 'assistant'
    const type = read('type') as string | undefined

    const { message, memory } = await memoryService.addMemory({
      content,
      role,
      type,
    })

    logger.log('info', `Memory ${type} added: ${content}`)

    write('memory', memory)
    write('message', message)

    commit('flow')
  },
})
