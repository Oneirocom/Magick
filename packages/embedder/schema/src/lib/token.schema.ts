import { z } from 'zod'

export const GenerateTokenRequestSchema = z.object({
  noExpiresAt: z.boolean().optional(),
  owner: z.string(),
  entity: z.string(),
})

export const GenerateTokenResponseSchema = z.object({
  token: z.string(),
})

export const DeleteTokenRequestSchema = z.object({
  agentId: z.string(),
})

export const DeleteTokenResponseSchema = z.object({
  id: z.string(),
})
