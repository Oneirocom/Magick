// budgets.service.js
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  budgetDataValidator,
  budgetPatchValidator,
  budgetQueryValidator,
  budgetResolver,
  budgetDataResolver,
  budgetPatchResolver,
  budgetQueryResolver,
  budgetExternalResolver,
} from './budgets.schema'
import type { Application } from '../../declarations'
import { BudgetService, getOptions } from './budgets.class'
import { checkPermissions } from '../../lib/feathersPermissions'

export * from './budgets.class'
export * from './budgets.schema'

export const budget = (app: Application) => {
  // Configure pagination
  app.set('paginate', {
    default: 1000,
    max: 1000,
  })

  app.use('budgets', new BudgetService(getOptions(app), app), {
    methods: ['get', 'create', 'patch', 'remove'],
  })

  app.service('budgets').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(budgetExternalResolver),
        schemaHooks.resolveResult(budgetResolver),
      ],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['owner', 'agent'],
        }),
        schemaHooks.validateQuery(budgetQueryValidator),
        schemaHooks.resolveQuery(budgetQueryResolver),
      ],
      get: [],
      create: [
        schemaHooks.validateData(budgetDataValidator),
        schemaHooks.resolveData(budgetDataResolver),
      ],
      patch: [
        schemaHooks.validateData(budgetPatchValidator),
        schemaHooks.resolveData(budgetPatchResolver),
      ],
      remove: [],
    },
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  })
}

// Declare module augmentation for ServiceTypes
declare module '../../declarations' {
  interface ServiceTypes {
    budgets: BudgetService
  }
}
