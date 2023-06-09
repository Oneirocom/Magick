import { CompletionHandlerInputData, getLogger } from '@magickml/core';
import AWS from 'aws-sdk';

interface UploadResult {
  success: boolean;
  result?: string | null;
  error?: string | null;
}

export async function uploadFileToS3(data: CompletionHandlerInputData): Promise<UploadResult> {
  const { node, inputs, context } = data;

  if (!context.module.secrets) {
    return { success: false, error: "No secrets found" };
  }

  // Configure AWS SDK with your S3 credentials
  AWS.config.update({
    apiVersion: "2010-12-01",
    accessKeyId: context.module.secrets["AWS_S3_ACCESS_KEY"],
    secretAccessKey: context.module.secrets["AWS_S3_SECRET_KEY"],
    region: "us-east-1"
  });


  const s3 = process.env.LOCAL_STORAGE
    ? new AWS.S3({
        endpoint: process.env.LOCAL_STORAGE_ENDPOINT, // Update with your S3 Ninja endpoint
        s3ForcePathStyle: true, // Required for S3 Ninja
      })
    : new AWS.S3();

  const params = {
    Bucket: node.data.bucketName as any,
    Key: node.data.fileName as any,
    Body: node.data.file as any,
  };

  return new Promise<UploadResult>((resolve, reject) => {
    s3.putObject(params, function (putErr, putData) {
      if (putErr) {
        resolve({ success: false, error: putErr.message });
      } else {
        const filePath = process.env.LOCAL_STORAGE
          ? `http://localhost:9444/${node.data.bucketName}/${node.data.fileName}`
          : `https://s3.amazonaws.com/${node.data.bucketName}/${node.data.fileName}`;
        resolve({ success: true, result: filePath });
      }
    });
  });
}