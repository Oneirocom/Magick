import { BadRequest } from '@feathersjs/errors'
import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { GlobalConfigInstance } from 'aws-sdk/lib/config'

export class UploadService {
  s3: AWS.S3
  uploader: any

  constructor() {
    // Set up AWS S3
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    })
    this.s3 = new AWS.S3({
      endpoint: process.env.AWS_BUCKET_ENDPOINT,
      s3ForcePathStyle: true,
    })

    // Set up multer to upload files to S3
    this.uploader = multer({
      storage: multerS3({
        s3: this.s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read', // we may need to adjust this
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname })
        },
        key: function (req, file, cb) {
          cb(null, Date.now().toString() + '-' + file.originalname)
        },
      }),
    })
  }

  async create(data: any, params?: any) {
    // Upload to S3
    return new Promise((resolve, reject) => {
      this.uploader.single('file')(data, {}, (error: any, result: any) => {
        if (error) {
          reject(new BadRequest('Error uploading file.', error))
        } else {
          resolve({
            message: 'File uploaded successfully.',
            fileUrl: result.location,
          })
        }
      })
    })
  }
}
