import { makeApi, Zodios } from '@zodios/core'
import { z } from 'zod'
import {
  idSchema,
  CreatePackRequestSchema,
  CreatePackResponseSchema,
  FindPackResponseSchema,
  DeletePackResponseSchema,
  PackQueryContextSchema,
  PackQueryRequestSchema,
} from '@magickml/embedder-schema'

export const packEndpoints = makeApi([
  {
    method: 'post',
    path: '/packs',
    alias: 'createPack',
    description: 'Create a new pack',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: CreatePackRequestSchema,
      },
    ],
    response: CreatePackResponseSchema,
    errors: [
      {
        status: 400,
        description: 'Invalid Request',
        schema: z.any(),
      },
    ],
  },
  {
    method: 'get',
    path: '/packs/:id',
    alias: 'findPack',
    description: 'Find a pack by ID',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: idSchema,
      },
    ],
    response: FindPackResponseSchema,
    errors: [
      {
        status: 400,
        description: 'Invalid Request',
        schema: z.any(),
      },
    ],
  },
  {
    method: 'delete',
    path: '/packs/:id',
    alias: 'deletePack',
    description: 'Delete a pack',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: idSchema,
      },
    ],
    response: DeletePackResponseSchema,
    errors: [
      {
        status: 400,
        description: 'Invalid Knowledge Pack ID',
        schema: z.any(),
      },
      {
        status: 404,
        description: 'Knowledge Pack not found',
        schema: z.any(),
      },
    ],
  },
  {
    method: 'get',
    path: '/packs',
    alias: 'getPacksByEntityAndOwner',
    description: 'Get all packs for the authenticated entity and owner',
    requestFormat: 'json',
    response: z.array(FindPackResponseSchema),
    errors: [
      {
        status: 400,
        description: 'Invalid Request',
        schema: z.any(),
      },
    ],
  },
  {
    method: 'post',
    path: '/packs/:id/query',
    alias: 'queryPack',
    description: 'Query a knowledge pack',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: idSchema,
      },
      {
        name: 'body',
        type: 'Body',
        schema: PackQueryRequestSchema,
      },
    ],
    response: z.object({
      result: z.string(),
      sources: z.array(z.string()),
    }),
    errors: [
      {
        status: 400,
        description: 'Invalid Request',
        schema: z.any(),
      },
    ],
  },
  {
    method: 'post',
    path: '/packs/:id/context',
    alias: 'getContext',
    description: 'Get context from a knowledge pack',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: idSchema,
      },
      {
        name: 'body',
        type: 'Body',
        schema: PackQueryRequestSchema,
      },
    ],
    response: PackQueryContextSchema,
    errors: [
      {
        status: 400,
        description: 'Invalid Request',
        schema: z.any(),
      },
    ],
  },
])

export const packApi = new Zodios(packEndpoints)
