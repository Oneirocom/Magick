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
    console.log('create presigned url')
    const id = v4()
    const projectId = params.query?.projectId as string | undefined

    const parse = PresignedUrlBody.safeParse(body)
    if (!projectId || !parse.success) {
      throw new Error(`Invalid request: ${!projectId ? 'projectId' : 'body'}`)
    }

    const { fileName, type } = parse.data

    const projectPresigner = getProjectPresigner(projectId)
    try {
      const presignedUrl = await projectPresigner.getPresignedUrl({
        type: ProjectPresignType[type],
        id,
        fileName,
      })

      return presignedUrl
    } catch (e) {
      throw Error('Error generating presigned URL')
    }
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
