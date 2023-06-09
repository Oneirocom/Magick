

import { CompletionProvider, pluginManager } from '@magickml/core';
export class UploadService {

  constructor() {

  }

  async create(body: any): Promise<any> {
    // Extract the necessary data from the request body
    const { id, base64Image } = body;

    // Convert the base64 image to a buffer
    const buffer = Buffer.from(base64Image, 'base64');

    try {
      // Upload the image to the bucket
      const completionProviders = pluginManager.getCompletionProviders('text', [
        'storage',
        'upload',
      ]) as CompletionProvider[]
      // get the provider for the selected model
      const provider = completionProviders.find(provider =>
        provider.models.includes("AWS")
      ) as CompletionProvider

      const completionHandler = provider.handler
      //@ts-ignore
      const url = await completionHandler("sample_bucket", buffer, "test.jpg")
      return {url};
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  async find(id: any): Promise<any> {

  }

  async remove(id: any, params: any): Promise<any> {

  }
}
