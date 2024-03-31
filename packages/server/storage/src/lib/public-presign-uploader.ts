import { UploadPresigner, UploadPresignerConfig } from './presigned-uploader'

export enum PublicPresignType {
  projectAvatar = 'projectAvatar',
  agentAvatar = 'agentAvatar',
  templateAvatar = 'templateAvatar',
}

const types: UploadPresignerConfig['presignTypes'] = {
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
}

const config: UploadPresignerConfig = {
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'YOUR_REGION',
  endpoint: 'YOUR_ENDPOINT',
  bucketName: 'YOUR_BUCKET_NAME',
  presignTypes: types,
}

export const publicPresigner = new UploadPresigner(config)
