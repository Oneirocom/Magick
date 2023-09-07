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
 * Uploads a file to a storage provider.
 *
 * @param {CompletionHandlerInputData} data - The input data for the upload completion API.
 * @returns {Promise<UploadResult>} - A Promise resolving to the result of the completion API call.
 */
export async function uploadFileToS3(
  data: CompletionHandlerInputData
): Promise<UploadResult> {
  const { node, inputs, context } = data
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

  const uploadedFilePaths: string[] = []

  const files = node.data.files as Uint8Array[]

  for (let i = 0; i < files.length; i++) {
    const params = {
      Bucket: node.data.bucketName as string,
      Key: `${inputs['fileName'][0]}-${i + 1}${
        node.data.fileExtension as string
      }`,
      Body: files[i],
    }

    logger.info('Uploading file to S3', params)

    try {
      await new Promise((resolve, reject) => {
        s3.putObject(params, function (putErr, putData) {
          if (putErr) {
            logger.error('Error uploading file to S3', putErr)
            reject(putErr)
          } else {
            const filePath = LOCAL_STORAGE
              ? `${LOCAL_STORAGE_ENDPOINT}/${params.Bucket}/${params.Key}`
              : `https://s3.amazonaws.com/${node.data.bucketName}/${params.Key}`
            uploadedFilePaths.push(filePath)
            resolve(putData)
          }
        })
      })
    } catch (putErr: any) {
      return { success: false, error: putErr.message }
    }
  }
  return { success: true, result: uploadedFilePaths }
}
