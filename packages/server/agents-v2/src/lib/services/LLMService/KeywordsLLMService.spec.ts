import { KeywordsLLMService } from './KeywordsLLMService' // Adjust the import path as needed
// import { z } from 'zod'
// import {
// GenerateObjectRequest,
// GenerateObjectResult,
// StreamObjectRequest,
// } from '@magickml/llm-service-types'

describe('KeywordsLLMService', () => {
  let service: KeywordsLLMService

  beforeEach(() => {
    service = new KeywordsLLMService()
  })

  describe('getProviders', () => {
    it('should fetch providers if not cached', async () => {
      const result = await service.getProviders()
      expect(result.length).toBeGreaterThan(0)
    })
  })

  // describe('getModels', () => {
  //   it('should fetch models if not cached', async () => {
  //     const providers = await service.getProviders()
  //     const providerId = providers[0].id

  //     const result = await service.getModels(providerId)
  //     expect(result.length).toBeGreaterThan(0)
  //   })
  // })

  // describe('generateText', () => {
  //   it('should generate text successfully', async () => {
  //     const providers = await service.getProviders()
  //     const providerId = providers[0].id
  //     const models = await service.getModels(providerId)

  //     const request = { model: models[0].id, prompt: 'Hello' }
  //     const extraMetadata = {
  //       provider: providerId,
  //       apiKey: process.env['KEYWORDS_API_KEY'], // Replace with actual API key
  //       customer_identifier: 'MP_user_2dIC8xjSe2zMhpXvqlQEo4fYRIO',
  //     }
  //     try {
  //       const result = await service.generateText(request, extraMetadata)
  //       expect(typeof result).toBe('string')
  //       expect(result.length).toBeGreaterThan(0)
  //     } catch (e) {
  //       console.error('ERROR', e)
  //       fail('generateText threw an error')
  //     }
  //   })
  // })

  // describe('streamText', () => {
  //   it('should stream text successfully', async () => {
  //     try {
  //       const providers = await service.getProviders()
  //       const providerId = providers[0].id
  //       const models = await service.getModels(providerId)

  //       const request = { model: models[0].id, prompt: 'Hello' }
  //       const extraMetadata = {
  //         provider: providerId,
  //         apiKey: process.env['KEYWORDS_API_KEY'],
  //         customer_identifier: 'MP_user_2dIC8xjSe2zMhpXvqlQEo4fYRIO',
  //       }

  //       const generator = service.streamText(request, extraMetadata)
  //       const result = []
  //       for await (const chunk of generator) {
  //         if (
  //           chunk.choices &&
  //           chunk.choices[0].delta &&
  //           chunk.choices[0].delta.content
  //         ) {
  //           if (chunk.choices[0].delta.content === '<START>') {
  //             continue
  //           }
  //           result.push(chunk.choices[0].delta.content)
  //         }
  //       }
  //       expect(result.join('').length).toBeGreaterThan(0)
  //     } catch (e) {
  //       console.error('ERROR', e)
  //       fail('streamText threw an error')
  //     }
  //   })
  // })

  // describe('generateObject', () => {
  //   it('should generate object successfully', async () => {
  //     const providers = await service.getProviders()
  //     const providerId = providers[0].id
  //     const models = await service.getModels(providerId)

  //     const schema = z.object({
  //       key: z.string(),
  //     })

  //     const request: GenerateObjectRequest<z.infer<typeof schema>> = {
  //       model: models[0].id,
  //       prompt: 'Generate an object',
  //       schema: schema,
  //     }
  //     const extraMetadata = {
  //       provider: providerId,
  //       apiKey: process.env['KEYWORDS_API_KEY'] || '',
  //       customer_identifier: 'MP_user_2dIC8xjSe2zMhpXvqlQEo4fYRIO',
  //     }

  //     try {
  //       const result = await service.generateObject(request, extraMetadata)
  //       expect(result.object).toEqual({ key: 'value' })
  //       expect(result.finishReason).toBe('stop')
  //       expect(result.usage.promptTokens).toBeGreaterThan(0)
  //       expect(result.usage.completionTokens).toBeGreaterThan(0)
  //     } catch (e) {
  //       console.error('ERROR', e)
  //       fail('generateObject threw an error')
  //     }
  //   })
  // })

  // describe('streamObject', () => {
  //   let service: KeywordsLLMService

  //   beforeAll(async () => {
  //     // Initialize the service or any necessary setup
  //     service = new KeywordsLLMService()
  //   })

  //   it('should stream object successfully', async () => {
  //     const providers = await service.getProviders()
  //     const providerId = providers[0].id
  //     const models = await service.getModels(providerId)

  //     const schema = z.object({
  //       magicSpells: z.string(),
  //     })

  //     const request: StreamObjectRequest<z.infer<typeof schema>> = {
  //       model: models[0].id,
  //       schema: schema,
  //       prompt: 'Generate a magic spell name',
  //     }
  //     const extraMetadata = {
  //       provider: providerId,
  //       apiKey: process.env['KEYWORDS_API_KEY'],
  //       customer_identifier: 'MP_user_2dIC8xjSe2zMhpXvqlQEo4fYRIO',
  //     }

  //     const generator = await service.streamObject(request, extraMetadata)
  //     console.log(generator)

  //     // Ensure the return type matches StreamObjectReturn<T>
  //     expect(generator).toHaveProperty('next')
  //     expect(generator).toHaveProperty('throw')
  //     expect(generator).toHaveProperty('return')
  //     expect(generator[Symbol.asyncIterator]).toBeDefined()

  //     const result: Array<any> = []

  //     for await (const chunk of generator) {
  //       console.log('Streamed chunk:', chunk)
  //       if (
  //         chunk.choices &&
  //         chunk.choices[0].delta &&
  //         chunk.choices[0].delta.content
  //       ) {
  //         result.push(chunk.choices[0].delta.content)
  //       }
  //     }

  //     console.log('Final streamed object:', result)
  //     expect(Array.isArray(result)).toBe(true)
  //     expect(result.length).toBeGreaterThan(0)

  //     // Validate the final combined object
  //     const finalObject = result[result.length - 1]
  //     expect(finalObject).toHaveProperty('magicSpells')
  //     expect(finalObject.magicSpells).toBeDefined()
  //   })
  // })
})
