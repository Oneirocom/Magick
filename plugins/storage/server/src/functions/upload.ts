// UNDOCUMENTED
import { CompletionHandlerInputData, getLogger } from '@magickml/core'
import { LOCAL_STORAGE, LOCAL_STORAGE_ENDPOINT } from '@magickml/config'
import AWS from 'aws-sdk'

/**
 * An object containing the result of the upload completion API call.
 * @typedef {Object} UploadResult
 * @property {boolean} success - Whether the upload was successful.
 * @property {Array<string> | null} [result] - The result of the upload.
 * @property {string | null} [error] - The error message, if any.
 */
interface UploadResult {
  success: boolean
  result?: Array<string> | null
  error?: string | null
}

/**
 * Uploads a file to S3.
 *
 * @param {CompletionHandlerInputData} data - The input data for the upload completion API.
 * @returns {Promise<UploadResult>} - A Promise resolving to the result of the completion API call.
 */
export async function uploadFileToS3(
  data: CompletionHandlerInputData
): Promise<UploadResult> {
  const { node, inputs, context } = data
  console.log('node', node)
  const logger = getLogger()

  if (!context.module.secrets) {
    return { success: false, error: 'No secrets found' }
  }

  // Configure AWS SDK with your S3 credentials
  AWS.config.update({
    apiVersion: node.data.apiVersion as string,
    accessKeyId: context.module.secrets['s3_access_key'],
    secretAccessKey: context.module.secrets['s3_secret_key'],
    region: node.data.region as string,
  })

  const s3 = new AWS.S3({
    endpoint: LOCAL_STORAGE ? LOCAL_STORAGE_ENDPOINT : undefined,
    s3ForcePathStyle: LOCAL_STORAGE ? true : undefined, // Required for S3 Ninja
  })

  const params = {
    Bucket: node.data.bucketName as any,
    Key: inputs['fileName'][0] as string,
    Body: node.data.file as any,
  }

  logger.info('Uploading file to S3', params)
  return new Promise<UploadResult>((resolve, reject) => {
    s3.putObject(params, function (putErr, putData) {
      if (putErr) {
        resolve({ success: false, error: putErr.message })
      } else {
        const filePath = LOCAL_STORAGE
          ? `${LOCAL_STORAGE_ENDPOINT}/${params.Bucket}/${params.Key}`
          : `https://s3.amazonaws.com/${node.data.bucketName}/${node.data.fileName}`
        resolve({ success: true, result: [filePath] })
      }
    })
  })
}
