// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { dataValidator, HookContext, queryValidator } from '@magickml/server-core'

export const QAScheme = Type.Object(
    {
        id: Type.String(),
        question: Type.String(),
    },
    { $id: 'QA', additionalProperties: false }
)
export const QADataScheme = Type.Pick(QAScheme, [
    'id',
    'question',
], {
    $id: 'QAData'
})
export type QA = Static<typeof QAScheme>;
export type QAData = Static<typeof QADataScheme>
export const QADataValidator = getValidator(QADataScheme, dataValidator)

// Schema for allowed query properties
export const QAQueryProperties = Type.Pick(QAScheme, [
    'id',
    'question',
])

export const QAQueryScheme = Type.Intersect(
    [
        querySyntax(QAQueryProperties),
        // Add additional query properties here
        Type.Object({
            'id': Type.Optional(Type.String()),
            'question': Type.String(),
        }, { additionalProperties: false })
    ],
    { additionalProperties: false }
)

export type QAQuery = Static<typeof QAQueryScheme>
export const QAQueryValidator = getValidator(QAQueryScheme, queryValidator)
export const QAQueryResolver = resolve<QAQuery, HookContext>({})
export const QAExternalResolver = resolve<QA, HookContext>({})
