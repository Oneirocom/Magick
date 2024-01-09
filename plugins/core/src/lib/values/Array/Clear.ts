import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { ArrayVariable } from './ArrayVariable'
import { IVariableService } from '../../services/variableService'

export const arrayClear = makeFlowNodeDefinition({
  typeName: 'action/array/clear',
  category: NodeCategory.Action,
  label: 'Clear',
  in: {
    flow: 'flow',
    array: 'array',
  },
  out: {
    flow: 'flow',
    array: 'array',
  },
  initialState: undefined,
  triggered: async ({ read, commit, write, graph: { getDependency } }) => {
    const array = read('array') as ArrayVariable<unknown>
    let newArray: unknown[] = []

    if (ArrayVariable.isInstance(array) && array.key) {
      const variableService =
        getDependency<IVariableService>('IVariableService')
      await variableService?.setByKey(array.key, [])
      newArray = await variableService?.getByKey(array.key)
    }

    write('array', newArray)
    commit('flow')
  },
})
