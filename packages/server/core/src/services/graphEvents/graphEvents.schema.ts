import { HookContext } from '../../declarations'
import { resolve } from '@feathersjs/schema'
import {
  Type,
  Static,
  getDataValidator,
  querySyntax,
  getValidator,
} from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../config/validators'

export const graphEventsSchemaPrototype = {
  id: Type.String(),
  sender: Type.Optional(Type.String()),
  agentId: Type.String(),
  connector: Type.Optional(Type.String()),
  connectorData: Type.Optional(Type.String()),
  content: Type.String(),
  eventType: Type.String(),
  event: Type.Optional(Type.Object({})),
}

export const graphEventsSchema = Type.Object(graphEventsSchemaPrototype, {
  $id: 'GraphEvents',
  additionalProperties: false,
})

export type GraphEvents = Static<typeof graphEventsSchema>
export const graphEventsResolver = resolve<GraphEvents, HookContext>({})
export const graphEventsExternalResolver = resolve<GraphEvents, HookContext>({})

export const graphEventsDataSchema = Type.Pick(
  graphEventsSchema,
  [
    'sender',
    'agentId',
    'connector',
    'connectorData',
    'content',
    'eventType',
    'event',
  ],
  {
    $id: 'GraphEventsData',
  }
)
export type GraphEventsData = Static<typeof graphEventsDataSchema>

export const graphEventsDataValidator = getDataValidator(
  graphEventsDataSchema,
  dataValidator
)

export const graphEventsDataResolver = resolve<GraphEvents, HookContext>({})
export const graphEventsPatchSchema = Type.Partial(graphEventsDataSchema, {
  $id: 'GraphEventsPatch',
})

export type GraphEventsPatch = Static<typeof graphEventsPatchSchema>
export const graphEventsPatchValidator = getDataValidator(
  graphEventsPatchSchema,
  dataValidator
)
export const graphEventsPatchResolver = resolve<GraphEvents, HookContext>({})

export const graphEventsQueryProperties = Type.Pick(graphEventsSchema, [
  'sender',
  'agentId',
  'connector',
  'connectorData',
  'content',
  'eventType',
  'event',
])

export const graphEventsQuerySchema = Type.Intersect(
  [
    querySyntax(graphEventsQueryProperties),
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
)

export type GraphEventsQuery = Static<typeof graphEventsQuerySchema>
export const graphEventsQueryValidator = getValidator(
  graphEventsQuerySchema,
  queryValidator
)
export const graphEventsQueryResolver = resolve<GraphEvents, HookContext>({})
