import { KeywordsLLMService } from './KeywordsLLMService'

async function testKeywordsLLMService() {
  const service = new KeywordsLLMService()

  try {
    // Test getProviders
    const providers = await service.getProviders()
    // console.log('Providers:', providers)

    if (providers.length > 0) {
      const providerId = providers[0].id

      // Test getModels
      const models = await service.getModels(providerId)
      // console.log('Models:', models)

      // Test generateText (assuming the first model's ID is valid for testing)
      if (models.length > 0) {
        const request = { model: models[0].id, prompt: 'Hello' }
        const extraMetadata = {
          provider: providerId,
          // apiKey: providers[0].apiKey,
          customer_identifier: 'MP_user_2dIC8xjSe2zMhpXvqlQEo4fYRIO',
        }

        const textResponse = await service.generateText(request, extraMetadata)
        console.log('Generated Text:', textResponse)

        // Test streamText (mocked implementation)
        const textStream = service.streamText(request, extraMetadata)
        for await (const chunk of textStream) {
          console.log('Streamed Text Chunk:', chunk)
        }
      }
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

testKeywordsLLMService()
