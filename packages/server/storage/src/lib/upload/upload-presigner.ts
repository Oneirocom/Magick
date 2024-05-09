// upload-presigner.ts
import { Storage } from '@google-cloud/storage'

export interface BucketConfig {
  projectId: string
  privateKey: string
  clientEmail: string
}

export type BucketType = 'public' | 'project'

export interface RootFolderConfig {
  rootFolderName: string | null // do not include any slashes
  rootFolderId: string | null // do not include any slashes
}

export interface UploadConfig {
  folder: string
  fileKey: string
}

export interface BucketSettings {
  type: BucketType
  uploadConfig: Record<string, UploadConfig>
  rootFolder: RootFolderConfig | null
}

export interface UploadPresignerConfig {
  config: BucketConfig
  settings: BucketSettings
}

export interface GetPresignedUrlOptions {
  type: string
  id: string
  fileName?: string
}

export interface PresignedUrlResponse {
  url: string
  key: string
}

export class UploadPresigner {
  private readonly storage: Storage
  private readonly bucketName: string
  private readonly uploadConfig: Record<string, UploadConfig>
  private readonly rootFolder: RootFolderConfig | null

  constructor({ config, settings }: UploadPresignerConfig) {
    this.storage = new Storage({
      projectId: config.projectId,
      credentials: {
        client_email: config.clientEmail,
        private_key: config.privateKey.replace(/\\n/g, '\n'),
      },
    })
    this.bucketName =
      settings.type === 'public'
        ? process.env['GOOGLE_PUBLIC_BUCKET_NAME'] ||
          'you-forgot-to-set-a-public-bucket-name'
        : process.env['GOOGLE_PRIVATE_BUCKET_NAME'] ||
          'you-forgot-to-set-a-private-bucket-name'

    this.uploadConfig = settings.uploadConfig
    this.rootFolder = settings.rootFolder
  }

  public async getPresignedUrl({
    type,
    id,
    fileName,
  }: GetPresignedUrlOptions): Promise<PresignedUrlResponse | null> {
    const { folder, fileKey } = this.uploadConfig[type]
    const { rootFolderName, rootFolderId } = this.rootFolder || {}

    let r = ''
    if (rootFolderName) {
      r = `${rootFolderName}/`
    }
    if (rootFolderId) {
      r += `${rootFolderId}/`
    }

    const key = `${r}${folder}/${id}/${fileName || fileKey}`
    const stamped = `${key}?t=${Date.now()}`

    try {
      const [url] = await this.storage
        .bucket(this.bucketName)
        .file(stamped)
        .getSignedUrl({
          version: 'v4',
          action: 'write',
          expires: Date.now() + 3600 * 1000, // 1 hour
          contentType: 'application/octet-stream',
        })

      console.log('Generated presigned URL', { url })
      return {
        url,
        key: stamped,
      }
    } catch (error) {
      console.error('Error generating presigned URL', { error })
      return null
    }
  }
}
