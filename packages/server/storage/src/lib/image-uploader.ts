import { S3Client, PutObjectCommand, PutObjectOutput } from '@aws-sdk/client-s3'

export enum UploadImageType {
  PROJECT_AVATAR = 'projectAvatar',
  AGENT_AVATAR = 'agentAvatar',
  TEMPLATE_AVATAR = 'templateAvatar',
}

export interface UploadImageConfig {
  accessKeyId: string
  secretAccessKey: string
  region: string
  endpoint: string
  bucketName: string
}

export class ImageUploader {
  private readonly s3: S3Client
  private readonly bucketName: string
  private readonly typeToFolderAndFileKeyMap: Record<
    UploadImageType,
    { folder: string; fileKey: string }
  >

  constructor(config: UploadImageConfig) {
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
      [UploadImageType.PROJECT_AVATAR]: {
        folder: 'projects',
        fileKey: 'avatar.jpg',
      },
      [UploadImageType.AGENT_AVATAR]: {
        folder: 'agents',
        fileKey: 'avatar.jpg',
      },
      [UploadImageType.TEMPLATE_AVATAR]: {
        folder: 'templates',
        fileKey: 'avatar.jpg',
      },
    }
  }

  private createBufferFromImage(image: string): Buffer {
    return Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  }

  public async uploadImage(
    id: string,
    image: string,
    type: UploadImageType
  ): Promise<PutObjectOutput> {
    const { folder, fileKey } = this.typeToFolderAndFileKeyMap[type]
    const buffer = this.createBufferFromImage(image)

    const s3Params = {
      Bucket: this.bucketName,
      Key: `${folder}/${id}/${fileKey}`,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    }

    const command = new PutObjectCommand(s3Params)

    try {
      return await this.s3.send(command)
    } catch (error) {
      console.error('Error uploading image to S3', { error })
      throw error
    }
  }
}
