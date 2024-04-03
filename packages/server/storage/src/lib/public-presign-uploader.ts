import { UploadPresigner } from './presigned-uploader'

export const publicPresigner = new UploadPresigner({
  accessKeyId: process.env?.['NEXT_AWS_ACCESS_KEY'] || '',
  secretAccessKey: process.env?.['NEXT_AWS_SECRET_KEY'] || '',
  region: process.env?.['NEXT_AWS_REGION'] || '',
  bucketName: process.env?.['NEXT_AWS_BUCKET_NAME'] || '',
  endpoint: process.env?.['NEXT_AWS_BUCKET_ENDPOINT'] || '',
})
