import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { IVariableService } from '../../services/variableService'
import { CORE_DEP_KEYS } from 'servicesShared'

export const variablesReset = makeFlowNodeDefinition({
  typeName: 'variables/reset',
  category: NodeCategory.Action,
  label: 'Reset Variables',
  configuration: {},
  in: {
    flow: 'flow',
  },
  out: {
    flow: 'flow',
  },
  initialState: undefined,
  triggered: async ({ commit, graph: { variables, getDependency } }) => {
    if (Object.values(variables).length === 0) return

    const variableService = getDependency<IVariableService>(
      CORE_DEP_KEYS.I_VARIABLE_SERVICE
    )

    if (!variableService) return

    // iterate over all variables
    for (const variable of Object.values(variables)) {
      await variableService.setVariable(
        variable.name,
        variable.initialValue,
        true
      )
    }

    commit('flow')
  },
})
