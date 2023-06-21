// DOCUMENTED 
import { resolve } from '@feathersjs/schema';
import { Type, getValidator, querySyntax } from '@feathersjs/typebox';
import type { Static } from '@feathersjs/typebox';

import type { HookContext } from '@magickml/server-core';
import { dataValidator, queryValidator } from '@magickml/server-core';

/**
 * Main data model schema
 */
export const apiSchema = Type.Object(
  {
    stability: Type.Number(),
    similarity_boost: Type.Number(),
    voice_id: Type.String(),
    elevenlabs_api_key: Type.String(),
    
  },
  { $id: 'ElevenlabsApi', additionalProperties: false },
);

export type Api = Static<typeof apiSchema>;
export const apiValidator = getValidator(apiSchema, dataValidator);
export const apiResolver = resolve<Api, HookContext>({});

/**
 * Schema for allowed query properties
 */
export const apiQueryProperties = Type.Pick(apiSchema, [
  'stability',
  'similarity_boost',
  'voice_id',
  'elevenlabs_api_key',
]);

export const apiQuerySchema = Type.Intersect(
  [
    querySyntax(apiQueryProperties),
    Type.Object(
      {
        stability: Type.Optional(Type.Number()),
        similarity_boost: Type.Optional(Type.Number()),
        voice_id: Type.Optional(Type.String()),
        elevenlabs_api_key: Type.String(),
      },
      { additionalProperties: false },
    ),
  ],
  { additionalProperties: false },
);

export type ApiQuery = Static<typeof apiQuerySchema>;
export const apiQueryValidator = getValidator(apiQuerySchema, queryValidator);
export const apiQueryResolver = resolve<ApiQuery, HookContext>({});