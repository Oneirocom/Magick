// DOCUMENTED
import { resolve } from '@feathersjs/schema'
import type { Static } from '@feathersjs/typebox'
import {
  getDataValidator,
  getValidator,
  querySyntax,
  Type,
} from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../config/validators'
import type { HookContext } from '../../declarations'

// Resolvers for SpellInterface
export const spellResolver = resolve<SpellInterface, HookContext>({})
export const spellExternalResolver = resolve<SpellInterface, HookContext>({})

import { SpellInterface, spellSchema } from 'shared/core'
// Schema for creating new entries, removing additional fields
// Define the properties for the new schema
const spellDataSchemaProperties = {
  name: spellSchema.properties.name,
  projectId: spellSchema.properties.projectId,
  graph: spellSchema.properties.graph,
  createdAt: spellSchema.properties.createdAt,
  updatedAt: spellSchema.properties.updatedAt,
  hash: spellSchema.properties.hash,
  type: spellSchema.properties.type,
  spellReleaseId: spellSchema.properties.spellReleaseId,
  id: spellSchema.properties.id,
}

export const spellDataSchema = Type.Object(spellDataSchemaProperties, {
  $id: 'SpellData',
})

export type SpellData = Static<typeof spellDataSchema>
export const spellDataValidator = getDataValidator(
  spellDataSchema,
  dataValidator
)
export const spellDataResolver = resolve<SpellInterface, HookContext>({
  createdAt: async () => new Date().toISOString(),
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
  'type',
  'createdAt',
  'updatedAt',
  'hash',
  'spellReleaseId',
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
