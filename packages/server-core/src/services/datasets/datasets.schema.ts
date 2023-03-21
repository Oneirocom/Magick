// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../config/validators'

// Main data model schema
export const datasetsSchema = Type.Object(
  {
    id: Type.Number(),
    projectId: Type.String(),
    dataset: Type.Object({
      data: Type.String(),
    }),
    name: Type.Optional(Type.String()),
    openaiFileId: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),
  },
  { $id: 'Datasets', additionalProperties: false }
)
export type Datasets = Static<typeof datasetsSchema>
export const datasetsValidator = getValidator(datasetsSchema, dataValidator)
export const datasetsResolver = resolve<Datasets, HookContext>({})

export const datasetsExternalResolver = resolve<Datasets, HookContext>({})

// Schema for creating new entries
export const datasetsDataSchema = Type.Pick(datasetsSchema, ['dataset'], {
  $id: 'DatasetsData',
})
export type DatasetsData = Static<typeof datasetsDataSchema>
export const datasetsDataValidator = getValidator(
  datasetsDataSchema,
  dataValidator
)
export const datasetsDataResolver = resolve<Datasets, HookContext>({})

// Schema for updating existing entries
export const datasetsPatchSchema = Type.Partial(datasetsSchema, {
  $id: 'DatasetsPatch',
})
export type DatasetsPatch = Static<typeof datasetsPatchSchema>
export const datasetsPatchValidator = getValidator(
  datasetsPatchSchema,
  dataValidator
)
export const datasetsPatchResolver = resolve<Datasets, HookContext>({})

// Schema for allowed query properties
export const datasetsQueryProperties = Type.Pick(datasetsSchema, [
  'id',
  'projectId',
  'name',
  'dataset',
  'openaiFileId',
  'createdAt',
  'updatedAt',
])
export const datasetsQuerySchema = Type.Intersect(
  [
    querySyntax(datasetsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
)
export type DatasetsQuery = Static<typeof datasetsQuerySchema>
export const datasetsQueryValidator = getValidator(
  datasetsQuerySchema,
  queryValidator
)
export const datasetsQueryResolver = resolve<DatasetsQuery, HookContext>({})
