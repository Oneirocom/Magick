import { S3Client, PutObjectCommand, PutObjectOutput } from '@aws-sdk/client-s3'
import {
  AWS_BUCKET_NAME,
  AWS_ACCESS_KEY,
  AWS_REGION,
  AWS_SECRET_KEY,
  AWS_BUCKET_ENDPOINT,
} from 'shared/config'

import { getLogger } from 'shared/core'

type AgentImageData = {
  image: string
  agentId: string
}

export class AgentImageService {
  s3: S3Client
  bucketName: string = AWS_BUCKET_NAME

  constructor() {
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

  createBufferFromImage(image: string): Buffer {
    return Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  }

  async create(data: AgentImageData): Promise<PutObjectOutput> {
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

      return await this.s3.send(command)
    } catch (error) {
      logger.error('Error uploading image to S3', { error })
      throw new Error('Failed to upload image to S3.')
    }
  }
}
