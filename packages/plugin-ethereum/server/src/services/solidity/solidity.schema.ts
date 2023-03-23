// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '@magickml/server-core'
import { dataValidator, queryValidator } from '@magickml/server-core'

// Main data model schema
export const soliditySchema = Type.Object(
  {
    id: Type.String(),
    code: Type.String(),
  },
  { $id: 'Solidity', additionalProperties: false }
)
export type Solidity = Static<typeof soliditySchema>
export const solidityValidator = getValidator(soliditySchema, dataValidator)
export const solidityResolver = resolve<Solidity, HookContext>({})

export const solidityExternalResolver = resolve<Solidity, HookContext>({})

// Schema for creating new entries
export const solidityDataSchema = Type.Pick(soliditySchema, [
  'id',
  'code',
], {
  $id: 'SolidityData'
})
export type SolidityData = Static<typeof solidityDataSchema>
export const solidityDataValidator = getValidator(solidityDataSchema, dataValidator)
export const solidityDataResolver = resolve<Solidity, HookContext>({})

// Schema for allowed query properties
export const solidityQueryProperties = Type.Pick(soliditySchema, [
  'id',
  'code',
])

export const solidityQuerySchema = Type.Intersect(
  [
    querySyntax(solidityQueryProperties),
    // Add additional query properties here
    Type.Object({
      'id': Type.Optional(Type.String()),
      'code': Type.String(),
    }, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type SolidityQuery = Static<typeof solidityQuerySchema>
export const solidityQueryValidator = getValidator(solidityQuerySchema, queryValidator)
export const solidityQueryResolver = resolve<SolidityQuery, HookContext>({})
