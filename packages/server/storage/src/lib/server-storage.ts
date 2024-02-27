import { PutObjectCommand, PutObjectOutput, S3Client } from '@aws-sdk/client-s3'
import { UploadImageType } from 'portal/cloud/packages/api/src/lib/utils/upload'
import { CreateClientOptions, typeToFolderAndFileKeyMap } from './types'

export const createClient = (options: CreateClientOptions) => {
  return new S3Client(options)
}

export class StorageManager {
  private client: S3Client

  constructor(client: S3Client) {
    this.client = client
  }

  private createBufferFromImage = (image: string): Buffer =>
    Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')

  uploadImage = async (
    id: string,
    image: string,
    type: UploadImageType
  ): Promise<PutObjectOutput> => {
    const { folder, fileKey } = typeToFolderAndFileKeyMap[type]
    const buffer = this.createBufferFromImage(image)

    const s3Params = {
      Bucket: process.env['NEXT_AWS_BUCKET_NAME']!,
      Key: `${folder}/${id}/${fileKey}`,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    }

    const command = new PutObjectCommand(s3Params)

    try {
      return await this.client.send(command)
    } catch (error) {
      console.error('Error uploading image to S3', { error })
      throw error
    }
  }
}
