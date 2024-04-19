import { UploadPresigner, UploadPresignerConfig } from './upload-presigner'

export enum PublicPresignType {
  projectAvatar = 'projectAvatar',
  agentAvatar = 'agentAvatar',
  templateAvatar = 'templateAvatar',
}

const config: UploadPresignerConfig = {
  settings: {
    type: 'public',
    uploadConfig: {
      [PublicPresignType.projectAvatar]: {
        folder: 'projects',
        fileKey: 'avatar.jpg',
      },
      [PublicPresignType.agentAvatar]: {
        folder: 'agents',
        fileKey: 'avatar.jpg',
      },
      [PublicPresignType.templateAvatar]: {
        folder: 'templates',
        fileKey: 'avatar.jpg',
      },
    },
    rootFolder: null,
  },

  config: {
    accessKeyId: process.env?.['NEXT_AWS_ACCESS_KEY_ID'] || '',
    secretAccessKey: process.env?.['NEXT_AWS_SECRET_ACCESS_KEY'] || '',
    region: process.env?.['NEXT_AWS_REGION'] || 'east-1',
    endpoint: process.env?.['NEXT_AWS_BUCKET_ENDPOINT'] || '',
    bucketName: process.env?.['NEXT_AWS_BUCKET_NAME'] || '',
  },
}

export const publicPresigner = new UploadPresigner(config)
