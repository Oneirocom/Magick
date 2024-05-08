// project-presigner.ts
import {
  BucketConfig,
  BucketSettings,
  UploadPresigner,
} from './upload-presigner'

export enum ProjectPresignType {
  knowledge = 'knowledge',
  eml = 'eml',
  html = 'html',
  json = 'json',
  md = 'md',
  msg = 'msg',
  rst = 'rst',
  rtf = 'rtf',
  txt = 'txt',
  xml = 'xml',
  jpeg = 'jpeg',
  jpg = 'jpg',
  png = 'png',
  csv = 'csv',
  doc = 'doc',
  docx = 'docx',
  epub = 'epub',
  odt = 'odt',
  pdf = 'pdf',
  ppt = 'ppt',
  pptx = 'pptx',
  tsv = 'tsv',
  xlsx = 'xlsx',
}

const bucketConfig: BucketConfig = {
  projectId: process.env['GOOGLE_CLOUD_PROJECT_ID'] || '',
  privateKey: process.env['GOOGLE_CLOUD_PRIVATE_KEY'] || '',
  clientEmail: process.env['GOOGLE_CLOUD_CLIENT_EMAIL'] || '',
}

const baseSettings: BucketSettings = {
  type: 'project',
  uploadConfig: {
    [ProjectPresignType.knowledge]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.eml]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    // ... (other file types)
  },
  rootFolder: null,
}

export const getProjectPresigner = (projectId: string) => {
  return new UploadPresigner({
    config: bucketConfig,
    settings: {
      ...baseSettings,
      rootFolder: {
        rootFolderId: projectId,
        rootFolderName: 'projects',
      },
    },
  })
}
