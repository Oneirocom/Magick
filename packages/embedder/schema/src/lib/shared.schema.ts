import { z } from 'zod'

export const idSchema = z.string().uuid()
export const idParse = idSchema.parse

export const StatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
])
