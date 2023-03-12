import { resolve } from '@feathersjs/schema'
import { Type, getDataValidator, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../config/validators'

// Main data model schema
export const spellSchema = Type.Object(
  {
    id: Type.String(),
    projectId: Type.String(),
    name: Type.String(),
    hash: Type.String(),
    graph: Type.Object({
      id: Type.String(),
      nodes: Type.Object({})
    }),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),
  },
  { $id: 'Spell', additionalProperties: false }
)
export type Spell = Static<typeof spellSchema>
export const spellResolver = resolve<Spell, HookContext>({})

export const spellExternalResolver = resolve<Spell, HookContext>({})

// Schema for creating new entries
export const spellDataSchema = Type.Pick(spellSchema, [
  'name',
  'projectId',
  'graph',
  'createdAt',
  'updatedAt',
  'hash',
], {
  $id: 'SpellData'
})
export type SpellData = Static<typeof spellDataSchema>
export const spellDataValidator = getDataValidator(spellDataSchema, dataValidator)
export const spellDataResolver = resolve<Spell, HookContext>({
  createdAt: async () => Date.now().toString()
})

// Schema for updating existing entries
export const spellPatchSchema = Type.Partial(spellDataSchema, {
  $id: 'SpellPatch'
})
export type SpellPatch = Static<typeof spellPatchSchema>
export const spellPatchValidator = getDataValidator(spellPatchSchema, dataValidator)
export const spellPatchResolver = resolve<Spell, HookContext>({
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
    querySyntax(spellQueryProperties,{
      name: process.env.DB_TYPE === 'postgres' ? {
        $ilike: Type.String()
      } : {
        $like: Type.String()
      }
    }),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type SpellQuery = Static<typeof spellQuerySchema>
export const spellQueryValidator = getValidator(spellQuerySchema, queryValidator)
export const spellQueryResolver = resolve<SpellQuery, HookContext>({})
export const spellJsonFields = ['graph']
