import AWS from 'aws-sdk'
import {
  AWS_BUCKET_NAME,
  AWS_ACCESS_KEY,
  AWS_REGION,
  AWS_SECRET_KEY,
  AWS_BUCKET_ENDPOINT,
} from '@magickml/config'

type AgentImageData = {
  image: string
  agentId: string
}

export class AgentImageService {
  s3: AWS.S3
  uploader: any
  bucketName: string = AWS_BUCKET_NAME

  constructor() {
    // Set up AWS S3
    AWS.config.update({
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
      region: AWS_REGION,
    })
    this.s3 = new AWS.S3({
      endpoint: AWS_BUCKET_ENDPOINT,
      s3ForcePathStyle: true,
    })
  }

  async create(data: AgentImageData) {
    const { image, agentId } = data
    const buffer = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    )

    const s3Params = {
      Bucket: this.bucketName,
      Key: `agents/${agentId}.jpg`,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    }

    try {
      const response = await this.s3.putObject(s3Params).promise()
      return {
        message: JSON.stringify(response),
      }
    } catch (error) {
      throw new Error('Failed to upload image to S3.')
    }
  }
}
