// public-presigner.ts
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
    projectId: process.env['GOOGLE_CLOUD_PROJECT_ID'] || '',
    privateKey: process.env['GOOGLE_CLOUD_PRIVATE_KEY'] || '',
    clientEmail: process.env['GOOGLE_CLOUD_CLIENT_EMAIL'] || '',
  },
}

export const publicPresigner = new UploadPresigner(config)
