// DOCUMENTED
import { resolve } from '@feathersjs/schema'
import { Type, Static } from '@feathersjs/typebox'
import type { HookContext } from '../../declarations'
import {
  getDataValidator,
  getValidator,
  querySyntax,
} from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../config/validators'
import { budgetSchema } from 'server/schemas'

/**
 * Budget type
 */
export type Budget = Static<typeof budgetSchema>

/**
 * Budget resolver
 */
export const budgetResolver = resolve<Budget, HookContext>({})

/**
 * Budget data schema for creating new entries
 */
export const budgetDataSchema = Type.Pick(
  budgetSchema,
  [
    'agent_id',
    'total_budget',
    'duration',
    'created_at',
    'updated_at',
    'current_cost',
    'alert_threshold',
    'notes',
    'alerted_at',
    'alert_frequency',
    'status',
    'reset_at',
  ],
  { $id: 'BudgetData' }
)

/**
 * Budget data type
 */
export type BudgetData = Static<typeof budgetDataSchema>

/**
 * Budget data validator
 */
export const budgetDataValidator = getDataValidator(
  budgetDataSchema,
  dataValidator
)

/**
 * Budget data resolver
 */
export const budgetDataResolver = resolve<Budget, HookContext>({})

/**
 * Budget patch data schema for updating entries
 */
export const budgetPatchDataSchema = Type.Partial(budgetDataSchema, {
  $id: 'BudgetPatch',
})

/**
 * Budget patch type
 */
export type BudgetPatch = Static<typeof budgetPatchDataSchema>

/**
 * Budget patch validator
 */
export const budgetPatchValidator = getDataValidator(
  budgetPatchDataSchema,
  dataValidator
)

/**
 * Budget patch resolver
 */
export const budgetPatchResolver = resolve<Budget, HookContext>({})

/**
 * Budget allowed query properties
 */
export const budgetQueryProperties = Type.Pick(budgetSchema, ['id', 'agent_id'])

/**
 * Budget query schema
 */
export const budgetQuerySchema = Type.Intersect(
  [querySyntax(budgetQueryProperties)],
  { additionalProperties: false }
)

/**
 * Budget query type
 */
export type BudgetQuery = Static<typeof budgetQuerySchema>

/**
 * Budget query validator
 */
export const budgetQueryValidator = getValidator(
  budgetQuerySchema,
  queryValidator
)

/**
 * Budget query resolver
 */
export const budgetQueryResolver = resolve<BudgetQuery, HookContext>({})

/**
 * Resolver for external budget requests.
 * Modifies the budget data before it's sent to the client.
 */
export const budgetExternalResolver = resolve<any, HookContext>({})
