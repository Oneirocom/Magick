import {
  ILogger,
  NodeCategory,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'
import { CoreBudgetManagerService } from '../../services/coreBudgetManagerService/coreBudgetMangerService'
import { CompletionResponse } from '../../services/coreLLMService/types'

export const budgetManager = makeFlowNodeDefinition({
  typeName: 'magick/budgetManager',
  category: NodeCategory.Action,
  label: 'Budget Manager',
  configuration: {
    // Configuration for the Budget Manager Node
  },
  in: {
    flow: 'flow',
    model: 'string',
    projectId: {
      valueType: 'string',
      defaultValue: '',
    },
    completionObj: {
      valueType: 'object',
      defaultValue: {},
    },
    messages: {
      valueType: 'array',
      defaultValue: [],
    },
    totalBudget: {
      valueType: 'number',
      defaultValue: 0,
    },
    duration: {
      valueType: 'string',
      choices: ['daily', 'weekly', 'monthly', 'yearly'],
      defaultValue: 'hourly',
    },
    operation: {
      valueType: 'string',
      choices: [
        'createBudget',
        'updateCost',
        'resetCost',
        'getCurrentCost',
        'projectedCost',
      ],
      defaultValue: 'createBudget',
    },
    // Include other inputs as necessary based on the operations
  },

  out: {
    result: 'string', // Assuming the result is an object
    done: 'flow',
  },
  initialState: undefined,
  triggered: async ({ commit, read, write, graph: { getDependency } }) => {
    try {
      const coreBudgetManagerService = getDependency<CoreBudgetManagerService>(
        'coreBudgetManagerService'
      )

      if (!coreBudgetManagerService) {
        throw new Error('No coreBudgetManagerService provided')
      }
      // TODO: remove my project id from the fallback
      const projectId: string = read('projectId') || 'clpna2wlx0005smpgehs9fz3m'
      const operation: string = read('operation') || 'createBudget'

      let result

      // Handle different budget operations
      switch (operation) {
        case 'createBudget':
          // Additional logic for creating a budget
          result = await coreBudgetManagerService.createBudget({
            totalBudget: read('totalBudget') || 0,
            projectId,
            duration: read('duration') || 'monthly',
          })
          break
        case 'updateCost':
          // Additional logic for updating cost
          result = await coreBudgetManagerService.updateCost(
            read('completionObj') || ({} as CompletionResponse),
            projectId
          )
          break
        case 'resetCost':
          // Additional logic for resetting cost
          result = await coreBudgetManagerService.resetCost(projectId)
          break
        case 'getCurrentCost':
          // Additional logic for getting current cost
          result = await coreBudgetManagerService.getCurrentCost(projectId)
          break
        case 'projectedCost':
          // Additional logic for calculating projected cost
          result = await coreBudgetManagerService.projectedCost({
            model: read('model') || '',
            messages: read('messages') || [],
            projectId,
          })
          break
        default:
          throw new Error(`Unknown operation: ${operation}`)
      }

      // Output the result and signal the end of the process
      write('result', result.toString())
      commit('done')
    } catch (error: any) {
      const loggerService = getDependency<ILogger>('ILogger')

      if (!loggerService) {
        throw new Error('No loggerService provided')
      }

      loggerService?.log('error', error.toString())
      console.error('Error in BudgetManager:', error)
      throw error
    }
  },
})
