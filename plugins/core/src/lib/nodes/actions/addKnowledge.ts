import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'

import { ICoreMemoryService } from '../../services/coreMemoryService/coreMemoryService'
import { CORE_DEP_KEYS } from '../../constants'
import { DataType } from 'servicesShared'

export const addKnowledge = makeFlowNodeDefinition({
  typeName: 'action/knowledge/add',
  category: NodeCategory.Action,
  label: 'Add Knowledge',
  in: {
    flow: 'flow',
    knowledge: 'string',
    dataType: {
      label: 'Data Type',
      choices: Object.values(DataType),
      defaultValue: DataType.AUTO,
      valueType: 'string',
    },
  },
  out: {
    flow: 'flow',
  },
  initialState: undefined,
  triggered: async ({ commit, read, graph }) => {
    const { getDependency } = graph
    const _dataType = read('dataType') as string
    const dataType = _dataType === 'auto' ? undefined : _dataType
    const coreMemoryService = getDependency<ICoreMemoryService>(
      CORE_DEP_KEYS.MEMORY_SERVICE
    )
    const knowledge = read('knowledge') as string

    await coreMemoryService?.add(knowledge, dataType)

    commit('flow')
  },
})
