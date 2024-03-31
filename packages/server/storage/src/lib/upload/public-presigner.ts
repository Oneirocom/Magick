// public-presigner.ts

import { UploadPresigner, UploadPresignerConfig } from './upload-presigner';

export enum PublicPresignType {
  projectAvatar = 'projectAvatar',
  agentAvatar = 'agentAvatar',
  templateAvatar = 'templateAvatar',
}

const types: UploadPresignerConfig['presignTypes'] = {
  [PublicPresignType.projectAvatar]: {
    folder: 'projects',
  },
  [PublicPresignType.agentAvatar]: {
    folder: 'agents',
  },
  [PublicPresignType.templateAvatar]: {
    folder: 'templates',
  },
};

const config: UploadPresignerConfig = {
  accessKeyId: process.env?.['NEXT_AWS_ACCESS_KEY_ID'] || '',
  secretAccessKey: process.env?.['NEXT_AWS_SECRET_ACCESS_KEY'] || '',
  region: process.env?.['NEXT_AWS_REGION'] || '',
  endpoint: process.env?.['PROJECT_AWS_BUCKET_ENDPOINT'] || '',
  bucketName: process.env?.['NEXT_AWS_BUCKET_NAME'] || '',
  presignTypes: types,
};

export const publicPresigner = new UploadPresigner(config);