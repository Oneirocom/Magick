import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export enum UploadPresignType {
  PROJECT_AVATAR = 'projectAvatar',
  AGENT_AVATAR = 'agentAvatar',
  TEMPLATE_AVATAR = 'templateAvatar',
}

export interface UploadPresignerConfig {
  accessKeyId: string
  secretAccessKey: string
  region: string
  endpoint: string
  bucketName: string
}

export class UploadPresigner {
  private readonly s3: S3Client
  private readonly bucketName: string
  private readonly typeToFolderAndFileKeyMap: Record<
    UploadPresignType,
    { folder: string; fileKey: string }
  >

  constructor(config: UploadPresignerConfig) {
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
    this.typeToFolderAndFileKeyMap = {
      [UploadPresignType.PROJECT_AVATAR]: {
        folder: 'projects',
        fileKey: 'avatar.jpg',
      },
      [UploadPresignType.AGENT_AVATAR]: {
        folder: 'agents',
        fileKey: 'avatar.jpg',
      },
      [UploadPresignType.TEMPLATE_AVATAR]: {
        folder: 'templates',
        fileKey: 'avatar.jpg',
      },
    }
  }

  public async getPresignedUrl(
    id: string,
    type: UploadPresignType
  ): Promise<string | null> {
    const { folder, fileKey } = this.typeToFolderAndFileKeyMap[type]
    const key = `${folder}/${id}/${fileKey}`

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: 'image/jpeg',
    })

    console.log('Generating presigned URL', { key })
    

    try {
      const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 })
      console.log('Generated presigned URL', { url })
      return url
    } catch (error) {
      console.error('Error generating presigned URL', { error })
      return null
    }
  }
}
