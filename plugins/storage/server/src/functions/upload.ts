import { CompletionHandlerInputData } from '@magickml/core';
import AWS from 'aws-sdk';





export async function uploadFileToS3(
    data: CompletionHandlerInputData
  ): Promise<{
    success: boolean;
    result?: string | null;
    error?: string | null;
  }> {
    const { node, inputs, context } = data;
    if (context.module.secrets == null) {
      return { success: false, error: "No secrets found" };
    }
  
    // Configure AWS SDK with your S3 credentials
    AWS.config.update({
      apiVersion: "2010-12-01",
      accessKeyId: context.module.secrets["AWS_S3_ACCESS_SECRET"],
      secretAccessKey: context.module.secrets["AWS_S3_ACCESS_KEY"],
      region: "us-east-1"
    });
    const s3 = new AWS.S3({
        endpoint: 'http://localhost:9444', // Update with your S3 or S3 Ninja endpoint
        s3ForcePathStyle: true, // Required for S3 Ninja
      });
      
    const params = {
      Bucket: node.data.bucketName as any,
      Key: node.data.fileName as any,
      Body: node.data.file as any,
    };
  
    console.log("params", params);
    try {
      const result = await new Promise<{
        success: boolean;
        result?: string | null;
        error?: string | null;
      }>((resolve, reject) => {
        s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
          if (err) {
            console.log("err", err)
            resolve({ success: false, error: err.message });
          } else {
            resolve({ success: true, result: data.Location });
          }
        });
      });
  
      return result;
    } catch (err) {
      return { success: false, error: "err as string" };
    }
  }