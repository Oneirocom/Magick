// DOCUMENTED 
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html

// Import necessary helper functions and types
import { resolve } from '@feathersjs/schema';
import { Type, getDataValidator, getValidator, querySyntax } from '@feathersjs/typebox';
import type { Static } from '@feathersjs/typebox';

import type { HookContext } from '../../declarations';
import { dataValidator, queryValidator } from '../../config/validators';

// Define the taskSchema
export const taskSchema = Type.Object(
  {
    id: Type.String(),
    type: Type.Optional(Type.String()),
    observer: Type.Optional(Type.String()),
    sender: Type.Optional(Type.String()),
    entities: Type.Optional(Type.Array(Type.String())),
    client: Type.Optional(Type.String()),
    channel: Type.Optional(Type.String()),
    channelType: Type.Optional(Type.String()),
    content: Type.Optional(Type.String()),
    agentId: Type.String(),
    projectId: Type.String(),
    date: Type.Optional(Type.String()),
    embedding: Type.Optional(Type.Any()),
    rawData: Type.Optional(Type.String()),
  },
  { $id: 'Task', additionalProperties: false }
);
export type Task = Static<typeof taskSchema>;
export const taskResolver = resolve<Task, HookContext>({});
export const taskExternalResolver = resolve<Task, HookContext>({});

// Define the taskDataSchema to create new entries
export const taskDataSchema = Type.Pick(taskSchema, [
  'type',
  'observer',
  'sender',
  'entities',
  'client',
  'channel',
  'channelType',
  'projectId',
  'content',
  'agentId',
  'date',
  'embedding',
  'rawData'
], {
  $id: 'TaskData'
});
export type TaskData = Static<typeof taskDataSchema>;

// Define the taskDataValidator
export const taskDataValidator = getDataValidator(taskDataSchema, dataValidator);
export const taskDataResolver = resolve<Task, HookContext>({});

// Define the taskPatchSchema to update existing entries
export const taskPatchSchema = Type.Partial(taskDataSchema, {
  $id: 'TaskPatch'
});
export type TaskPatch = Static<typeof taskPatchSchema>;

// Define the taskPatchValidator for taskPatchSchema
export const taskPatchValidator = getDataValidator(taskPatchSchema, dataValidator);
export const taskPatchResolver = resolve<Task, HookContext>({});

// Define the taskQueryProperties and taskQuerySchema
export const taskQueryProperties = Type.Pick(taskSchema, [
  'id',
  'type',
  'observer',
  'sender',
  'entities',
  'client',
  'channel',
  'channelType',
  'projectId',
  'content',
  'agentId',
  'date',
  'embedding',
  'rawData'
]);
export const taskQuerySchema = Type.Intersect(
  [
    querySyntax(taskQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
);

// Define the query validator and resolver for taskQuerySchema
export type TaskQuery = Static<typeof taskQuerySchema>;
export const taskQueryValidator = getValidator(taskQuerySchema, queryValidator);
export const taskQueryResolver = resolve<TaskQuery, HookContext>({});