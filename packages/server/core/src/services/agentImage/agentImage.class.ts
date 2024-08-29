import { S3Client, PutObjectCommand, PutObjectOutput } from '@aws-sdk/client-s3'
import {
  AWS_BUCKET_NAME,
  AWS_ACCESS_KEY,
  AWS_REGION,
  AWS_SECRET_KEY,
  AWS_BUCKET_ENDPOINT,
} from '@magickml/server-config'

import { getLogger } from '@magickml/server-logger'

type AgentImageData = {
  image: string
  agentId: string
}

export class AgentImageService {
  s3: S3Client | null = null
  bucketName: string = AWS_BUCKET_NAME

  constructor() {
    if (this.isS3Configured()) {
      this.s3 = new S3Client({
        credentials: {
          accessKeyId: AWS_ACCESS_KEY,
          secretAccessKey: AWS_SECRET_KEY,
        },
        region: AWS_REGION,
        endpoint: AWS_BUCKET_ENDPOINT,
        forcePathStyle: true,
      })
    }
  }

  private isS3Configured(): boolean {
    return !!(
      AWS_ACCESS_KEY &&
      AWS_SECRET_KEY &&
      AWS_ACCESS_KEY.trim() !== '' &&
      AWS_SECRET_KEY.trim() !== ''
    )
  }

  createBufferFromImage(image: string): Buffer {
    return Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  }

  async create(data: AgentImageData): Promise<PutObjectOutput | null> {
    if (!this.isS3Configured()) {
      console.log('Agent Image Service is not configured')
      return null
    }

    const logger = getLogger()

    try {
      const { image, agentId } = data
      const buffer = this.createBufferFromImage(image)

      const s3Params = {
        Bucket: this.bucketName,
        Key: `agents/${agentId}/avatar.jpg`,
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
      }

      const command = new PutObjectCommand(s3Params)

      const result = await this.s3!.send(command)
      console.log('Image uploaded to S3', { result })
      logger.info('Image uploaded to S3', { result })
      return result
    } catch (error) {
      console.log('Error uploading image to S3', { error })
      logger.error('Error uploading image to S3', { error })
      throw new Error('Failed to upload image to S3.')
    }
  }
}
