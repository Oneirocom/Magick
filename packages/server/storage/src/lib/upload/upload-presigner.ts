import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface UploadPresignerConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  endpoint: string;
  bucketName: string;
  presignTypes: Record<string, { folder: string; fileKey?: string }>;
}

export class UploadPresigner {
  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly typeToFolderAndFileKeyMap: Record<
    string,
    { folder: string; fileKey?: string }
  >;

  constructor(config: UploadPresignerConfig) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: true,
    });
    this.bucketName = config.bucketName;
    this.typeToFolderAndFileKeyMap = config.presignTypes;
  }

  public async getPresignedUrl(
    id: string,
    fileName: string,
    type: string
  ) {
    const { folder, fileKey } = this.typeToFolderAndFileKeyMap[type];
    const key = fileKey ? `${folder}/${id}/${fileKey}/${fileName}` : `${folder}/${id}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: 'application/octet-stream',
    });

    console.log('Generating presigned URL', { key });

    try {
      const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
      console.log('Generated presigned URL', { url });
      return {
        url: url,
        key: key,
      }
    } catch (error) {
      console.error('Error generating presigned URL', { error });
      return null;
    }
  }
}