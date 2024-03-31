// project-presigner.ts

import { UploadPresigner, UploadPresignerConfig } from './upload-presigner';

export enum ProjectPresignType {
  knowledge = 'knowledge',
}

const types: UploadPresignerConfig['presignTypes'] = {
  [ProjectPresignType.knowledge]: {
    folder: 'projects',
    fileKey: 'knowledge',
  },
};

const config: UploadPresignerConfig = {
  accessKeyId: process.env?.['PROJECT_AWS_ACCESS_KEY_ID'] || '',
  secretAccessKey: process.env?.['PROJECT_AWS_SECRET_ACCESS'] || '',
  region: process.env?.['PROJECT_AWS_REGION'] || '',
  endpoint: process.env?.['PROJECT_AWS_ENDPOINT'] || '',
  bucketName: process.env?.['PROJECT_AWS_BUCKET_NAME'] || '',
  presignTypes: types,
};

export const projectPresigner = new UploadPresigner(config);