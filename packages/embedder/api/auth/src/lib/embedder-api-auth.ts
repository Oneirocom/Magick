import { makeApi, Zodios } from '@zodios/core'
import { z } from 'zod'
import {
  DeleteTokenRequestSchema,
  DeleteTokenResponseSchema,
  GenerateTokenRequestSchema,
  GenerateTokenResponseSchema,
} from '@magickml/embedder-schemas'

export const tokenEndpoints = makeApi([
  {
    method: 'post',
    path: '/auth/token/generate',
    alias: 'generateToken',
    description: 'Generate a new token',
    requestFormat: 'json',
    request: GenerateTokenRequestSchema,
    response: GenerateTokenResponseSchema,
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
    path: '/auth/token/delete',
    alias: 'deleteToken',
    description: 'Delete a token',
    requestFormat: 'json',
    request: DeleteTokenRequestSchema,
    response: DeleteTokenResponseSchema,
    errors: [
      {
        status: 400,
        description: 'Invalid Request',
        schema: z.any(),
      },
    ],
  },
])

export const EmbedderApiAuth = new Zodios(tokenEndpoints)
