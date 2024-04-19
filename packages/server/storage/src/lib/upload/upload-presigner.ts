import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export interface BucketConfig {
  accessKeyId: string
  secretAccessKey: string
  region: string
  endpoint: string
  bucketName: string
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
  private readonly s3: S3Client
  private readonly bucketName: string
  private readonly uploadConfig: Record<string, UploadConfig>
  private readonly rootFolder: RootFolderConfig | null

  constructor({ config, settings }: UploadPresignerConfig) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: true,
    })
    this.bucketName = config.bucketName
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
    // const r = rootFolderName ? `${rootFolderName}/${rootFolderId}` : ''
    let r = ''
    if (rootFolderName) {
      r = `${rootFolderName}/`
    }

    if (rootFolderId) {
      r += `${rootFolderId}/`
    }

    const f = `${folder}/${id}`

    const name = fileName || fileKey

    //r: `projects/${data.projectId}/
    //
    // knowledge/${uuid}/${file.originalFilename}`
    const key = `${r}${folder}/${id}/${fileName || fileKey}`

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: 'application/octet-stream',
    })

    try {
      const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 }) // 1 hour
      console.log('Generated presigned URL', { url })
      return {
        url: url,
        key: key,
      }
    } catch (error) {
      console.error('Error generating presigned URL', { error })
      return null
    }
  }
}
