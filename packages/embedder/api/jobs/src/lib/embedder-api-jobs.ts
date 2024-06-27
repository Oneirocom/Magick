import { makeApi, Zodios } from '@zodios/core'
import { z } from 'zod'

import { idSchema, JobSchema, JobStatusSchema } from '@magickml/embedder-schema'

export const jobEndpoints = makeApi([
  {
    method: 'get',
    path: '/jobs',
    alias: 'getAllJobs',
    description: 'Get all jobs',
    requestFormat: 'json',
    response: z.array(JobSchema),
  },
  {
    method: 'get',
    path: '/jobs/:id',
    alias: 'getJobById',
    description: 'Get a job by ID',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: idSchema,
      },
    ],
    response: JobSchema,
  },
  {
    method: 'get',
    path: '/jobs/entity/:entityId',
    alias: 'getJobsForEntity',
    description: 'Get jobs for an entity',
    requestFormat: 'json',
    parameters: [
      {
        name: 'entityId',
        type: 'Path',
        schema: idSchema,
      },
    ],
    response: z.array(JobSchema),
  },
  {
    method: 'patch',
    path: '/jobs/:id/status',
    alias: 'updateJobStatus',
    description: 'Update the status of a job',
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
        schema: z.object({
          status: JobStatusSchema,
        }),
      },
    ],
    response: JobSchema,
  },
])

export const jobApi = new Zodios(jobEndpoints)
