import AWS from 'aws-sdk'


type AgentImageData = {
  image: string
  agentId: string
}

export class AgentImageService {
  s3: AWS.S3
  uploader: any
  bucketName: string = process.env.AWS_BUCKET_NAME || 'BUCKET_NAME'

  constructor() {
    // Set up AWS S3
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    })
    this.s3 = new AWS.S3({
      endpoint: process.env.AWS_BUCKET_ENDPOINT,
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
      console.log('S3 upload response', response)
      return {
        message: 'File uploaded successfully.',
      }
    } catch (error) {
      console.error('Error uploading to S3:', error)
      throw new Error('Failed to upload image to S3.')
    }
  }
}
