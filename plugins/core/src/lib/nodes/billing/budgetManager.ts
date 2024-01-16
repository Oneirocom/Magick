import {
  ILogger,
  NodeCategory,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'
import { CoreBudgetManagerService } from '../../services/coreBudgetManagerService/coreBudgetMangerService'
// import { CompletionResponse } from '../../services/coreLLMService/types'

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
        'resetOnDuration',
        'getCurrentCost',
        'projectedCost',
        'getTotalBudget',
        'getModelCost',
        'isValidUser',
        'getUsers',
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
      const totalBudget: number = read('totalBudget') || 10
      const durationVal: string = read('duration') || 'monthly'
      const model: string = read('model') || 'gpt-3.5-turbo'
      const completionObj: any = read('completionObj') || ({} as any)
      // const completionObj = await completionObject

      console.log('completionObj', {
        completionObj,
        messages: await completionObj._python_object.choices,
        messages2: completionObj.choices,
      })
      const messages = completionObj.choices || []
      let result

      // Handle different budget operations
      switch (operation) {
        case 'createBudget':
          result = await coreBudgetManagerService.createBudget({
            totalBudget,
            projectId,
            duration: durationVal as any,
          })
          break
        case 'getTotalBudget':
          result = await coreBudgetManagerService.getTotalBudget(projectId)
          break
        case 'getModelCost':
          result = await coreBudgetManagerService.getModelCost(projectId)
          break
        case 'resetOnDuration':
          result = await coreBudgetManagerService.resetOnDuration(projectId)
          break
        case 'getUsers':
          result = await coreBudgetManagerService.getUsers()
          break
        case 'isValidUser':
          result = await coreBudgetManagerService.isValidUser(projectId)
          break
        case 'updateCost':
          result = await coreBudgetManagerService.updateCost(
            projectId,
            completionObj._python_object
          )
          break
        case 'resetCost':
          result = await coreBudgetManagerService.resetCost(projectId)
          break
        case 'getCurrentCost':
          result = await coreBudgetManagerService.getCurrentCost(projectId)
          break
        case 'projectedCost':
          result = await coreBudgetManagerService.projectedCost({
            model,
            messages,
            projectId,
          })
          break
        default:
          throw new Error(`Unknown operation: ${operation}`)
      }

      // Output the result and signal the end of the process
      write('result', result?.toString())
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
