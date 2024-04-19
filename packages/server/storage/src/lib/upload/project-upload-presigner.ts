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
  accessKeyId: process.env?.['PROJECT_AWS_ACCESS_KEY_ID'] || '',
  secretAccessKey: process.env?.['PROJECT_AWS_SECRET_ACCESS'] || '',
  region: process.env?.['PROJECT_AWS_REGION'] || 'east-1',
  endpoint: process.env?.['PROJECT_AWS_ENDPOINT'] || '',
  bucketName: process.env?.['PROJECT_AWS_BUCKET_NAME'] || '',
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
    [ProjectPresignType.html]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.json]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.md]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.msg]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.rst]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.rtf]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.txt]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.xml]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.jpeg]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.jpg]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.png]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.csv]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.doc]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.docx]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.epub]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.odt]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.pdf]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.ppt]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.pptx]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.tsv]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
    [ProjectPresignType.xlsx]: {
      folder: 'knowledge',
      fileKey: 'knowledge',
    },
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
