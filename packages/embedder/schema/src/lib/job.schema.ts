import { z } from 'zod'
import { StatusSchema } from './shared.schema'

export const JobStatusSchema = StatusSchema

export type JobStatusType = z.infer<typeof JobStatusSchema>

export const JobStatus = JobStatusSchema.Enum

export const JobSchema = z.object({
  id: z.string().uuid(),
  entity: z.string(),
  packId: z.string().uuid(),
  loaders: z.array(z.any()), // use the LoaderSchema directly to validate this
  status: JobStatusSchema,
  createdAt: z.string(),
  finishedAt: z.string().optional().or(z.null()),
})
export type JobData = z.infer<typeof JobSchema>
