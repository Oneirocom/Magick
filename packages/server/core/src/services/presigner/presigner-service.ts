import { Params, ServiceMethods } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { z } from 'zod'
import { projectPresigner, ProjectPresignType } from 'server-storage'

const PresignedUrlBody = z.object({
  id: z.string(),
  fileName: z.string(),
  type: z.nativeEnum(ProjectPresignType),
  key: z.string().optional(),
})

type PresignedUrlBody = z.infer<typeof PresignedUrlBody>

export type PresignedUrlServiceMethods = Pick<
  ServiceMethods<PresignedUrlBody>,
  'create'
>

class PresignedUrlService implements PresignedUrlServiceMethods {
  app: Application
  options: any

  constructor(options: any = {}, app: Application) {
    this.app = app
    this.options = options
  }

  async create(
    body: PresignedUrlBody,
    params: Params
  ): Promise<{ url: string; key: string } | null> {
    const { id, fileName, type } = PresignedUrlBody.parse(body)
    const projectId = params.query?.projectId as string

    if (!projectId) {
      throw new Error('Missing projectId query parameter')
    }

    // Generate the presigned URL using the projectPresigner
    const presignedUrl = await projectPresigner.getPresignedUrl(
      id,
      fileName,
      type
    )

    return presignedUrl
  }
}

export const presigner = (app: Application): void => {
  app.use('/presigner', new PresignedUrlService({}, app))
}

declare module '../../declarations' {
  interface ServiceTypes {
    ['/presigner']: PresignedUrlService
  }
}
