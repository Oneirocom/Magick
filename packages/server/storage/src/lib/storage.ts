import {
  PutObjectCommand,
  PutObjectOutput,
  S3Client,
  GetObjectCommand,
  PutObjectCommandInput,
  ObjectCannedACL,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export enum BucketName {
  UserBucket = 'user-bucket',
  ProjectBucket = 'project-bucket',
  AgentBucket = 'agent-bucket',
}

export enum UploadFileType {
  Avatar = 'avatar.jpg',
  Banner = 'banner.jpg',
}

export interface CreateClientOptions {
  credentials: {
    accessKeyId: string
    secretAccessKey: string
  }
  region: string
  endpoint: string
  forcePathStyle: boolean
}

export interface UploadConfig {
  bucketName: BucketName
  contentType: string
  acl?: ObjectCannedACL | undefined
}

export interface UploadPathConfig {
  [key: string]: UploadConfig
}

const uploadPathConfig: UploadPathConfig = {
  userAvatar: {
    bucketName: BucketName.UserBucket,
    contentType: 'image/jpeg',
  },
  userBanner: {
    bucketName: BucketName.UserBucket,
    contentType: 'image/jpeg',
  },
  projectAvatar: {
    bucketName: BucketName.ProjectBucket,
    contentType: 'image/jpeg',
  },
  agentAvatar: {
    bucketName: BucketName.AgentBucket,
    contentType: 'image/jpeg',
  },
}

export class StorageManager {
  private client: S3Client

  constructor(client: S3Client) {
    this.client = client
  }

  private createBufferFromImage = (image: string): Buffer =>
    Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')

  async uploadFile(
    id: string,
    file: string,
    pathKey: keyof UploadPathConfig,
    fileType: UploadFileType
  ): Promise<PutObjectOutput> {
    const buffer = this.createBufferFromImage(file)
    const config = uploadPathConfig[pathKey]

    const s3Params: PutObjectCommandInput = {
      Bucket: config.bucketName,
      Key: `${id}/${fileType}`,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: config.contentType,
      ACL: config.acl,
    }

    const command = new PutObjectCommand(s3Params)

    try {
      return await this.client.send(command)
    } catch (error) {
      console.error('Error uploading file to S3', { error })
      throw error
    }
  }

  async getPresignedUrl(bucket: BucketName, key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    try {
      return await getSignedUrl(this.client, command, { expiresIn: 3600 })
    } catch (error) {
      console.error('Error generating presigned URL', { error })
      throw error
    }
  }
}
