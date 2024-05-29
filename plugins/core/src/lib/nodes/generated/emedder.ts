import { loaderEndpoints } from '@magickml/embedder/api/loaders'
import { jobEndpoints } from '@magickml/embedder/api/jobs'
import { packEndpoints } from '@magickml/embedder/api/packs'
import { createZodiosNode, safeCreateZodiosNode } from 'server/plugin'
import {
  DenoSchema,
  TursoSchema,
  ReplicateSchema,
} from '@magickml/zode'

const denoEndpoints = DenoSchema.endpoints
const tursoEndpoints = TursoSchema.endpoints
const replicateEndpoints = ReplicateSchema.endpoints

const getHeaders = () => ({})
const service = 'embedder' as const
const baseUrl = 'http://localhost:3000/api'
const options = {}

export const embedderNodes = [
  ...loaderEndpoints,
  ...jobEndpoints,
  ...packEndpoints,
]
  .map(def =>
    safeCreateZodiosNode({ def, baseUrl, service, options, getHeaders })
  )
  .filter(node => node !== null)

export const denoService = 'deno' as const

export const denoNodes = denoEndpoints
  .map(def =>
    safeCreateZodiosNode({
      def,
      baseUrl,
      service: denoService,
      options,
      getHeaders,
    })
  )
  .filter(node => node !== null)

export const tursoService = 'turso' as const

export const tursoNodes = tursoEndpoints
  .map(def =>
    safeCreateZodiosNode({
      def,
      baseUrl,
      service: tursoService,
      options,
      getHeaders,
    })
  )
  .filter(node => node !== null)

export const directusService = 'directus' as const

export const replicateService = 'replicate' as const

export const replicateNodes = replicateEndpoints
  .map(def =>
    safeCreateZodiosNode({
      def,
      baseUrl,
      service: replicateService,
      options,
      getHeaders,
    })
  )
  .filter(node => node !== null)
