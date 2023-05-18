// DOCUMENTED
import { resolve } from '@feathersjs/schema'
import type { Static } from '@feathersjs/typebox'
import {
  getDataValidator,
  getValidator,
  querySyntax,
  Type,
} from '@feathersjs/typebox'
import { SpellInterface, spellSchema } from '@magickml/core'
import { dataValidator, queryValidator } from '../../config/validators'
import type { HookContext } from '../../declarations'

// Resolvers for SpellInterface
export const spellResolver = resolve<SpellInterface, HookContext>({})
export const spellExternalResolver = resolve<SpellInterface, HookContext>({})

// Schema for creating new entries, removing additional fields
export const spellDataSchema = Type.Pick(
  spellSchema,
  ['name', 'id', 'projectId', 'graph', 'createdAt', 'updatedAt', 'hash'],
  {
    $id: 'SpellData',
  }
)
export type SpellData = Static<typeof spellDataSchema>
export const spellDataValidator = getDataValidator(
  spellDataSchema,
  dataValidator
)
export const spellDataResolver = resolve<SpellInterface, HookContext>({
  createdAt: async () => Date.now().toString(),
})

// Schema for updating existing entries, making all properties optional
export const spellPatchSchema = Type.Partial(spellDataSchema, {
  $id: 'SpellPatch',
})
export type SpellPatch = Static<typeof spellPatchSchema>
export const spellPatchValidator = getDataValidator(
  spellPatchSchema,
  dataValidator
)
export const spellPatchResolver = resolve<SpellInterface, HookContext>({
  updatedAt: async () => Date.now().toString(),
})

// Schema for allowed query properties
export const spellQueryProperties = Type.Pick(spellSchema, [
  'id',
  'name',
  'projectId',
  'graph',
  'createdAt',
  'updatedAt',
  'hash',
])
export const spellQuerySchema = Type.Intersect(
  [
    querySyntax(spellQueryProperties, {
      name: {
        $ilike: Type.String(),
      },
    }),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
)
export type SpellQuery = Static<typeof spellQuerySchema>
export const spellQueryValidator = getValidator(
  spellQuerySchema,
  queryValidator
)
export const spellQueryResolver = resolve<SpellQuery, HookContext>({})
export const spellJsonFields = ['graph']
