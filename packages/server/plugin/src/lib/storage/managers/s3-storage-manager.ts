import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PluginStorageManager } from '../plugin-storage-manager'

export class S3PluginStorageManager extends PluginStorageManager {
  private s3: S3Client

  constructor(
    agentId: string,
    plugin: string,
    accessKeyId: string,
    secretAccessKey: string,
    region: string,
    private bucket: string
  ) {
    super(agentId, plugin)
    this.s3 = new S3Client({
      credentials: { accessKeyId, secretAccessKey },
      region,
    })
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string
  ): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: `${this.agentId}/${this.plugin}/${fileName}`,
      Body: file,
      ContentType: contentType,
    }

    const command = new PutObjectCommand(params)
    await this.s3.send(command)
    return this.getFileUrl(fileName)
  }

  async getFileUrl(fileName: string): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: `${this.agentId}/${this.plugin}/${fileName}`,
    }

    const command = new GetObjectCommand(params)
    return getSignedUrl(this.s3, command, { expiresIn: 900 }) // URL expires in 15 minutes
  }

  async deleteFile(fileName: string): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: `${this.agentId}/${this.plugin}/${fileName}`,
    }

    const command = new DeleteObjectCommand(params)
    await this.s3.send(command)
  }
}
