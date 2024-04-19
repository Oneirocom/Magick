import { Params, ServiceMethods } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { z } from 'zod'
import { getProjectPresigner, ProjectPresignType } from 'server-storage'
import { v4 } from 'uuid'

const PresignedUrlBody = z.object({
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
    const id = v4()
    const { fileName, type } = PresignedUrlBody.parse(body)
    const projectId = params.query?.projectId as string | undefined
    if (!projectId) {
      throw new Error('projectId is required')
    }

    const projectPresigner = getProjectPresigner(projectId)

    const presignedUrl = await projectPresigner.getPresignedUrl({
      type: ProjectPresignType[type],
      id,
      fileName,
    })

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
