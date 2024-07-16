import { createOpenAI } from '@magickml/vercel-sdk-core'

import { KeywordsLLMService } from './KeywordsLLMService' // Adjust the import path as needed

import { z } from 'zod'
import {
  GenerateObjectRequest,
  GenerateObjectResult,
  StreamObjectRequest,
} from '@magickml/llm-service-types'
import { KeywordsService } from '@magickml/keywords-service'

// Mock the dependencies
jest.mock('@magickml/keywords-service')
jest.mock('@magickml/vercel-sdk-core')
jest.mock('ai')

describe('KeywordsLLMService', () => {
  let service: KeywordsLLMService

  beforeEach(() => {
    service = new KeywordsLLMService()
  })

  describe('getProviders', () => {
    it('should return cached providers if available', async () => {
      const mockProviders = [
        { id: 'provider1', name: 'Provider 1', apiKey: 'key1' },
      ]
      ;(service as any).providersCache = mockProviders

      const result = await service.getProviders()

      expect(result).toEqual(mockProviders)
    })

    it('should fetch providers if not cached', async () => {
      const mockModels = {
        provider1: { providerName: 'Provider 1', apiKey: 'key1', models: [] },
      }
      ;(KeywordsService.prototype.fetchModels as jest.Mock).mockResolvedValue(
        mockModels
      )

      const result = await service.getProviders()

      expect(result).toEqual([
        { id: 'provider1', name: 'Provider 1', apiKey: 'key1' },
      ])
    })
  })

  describe('getModels', () => {
    it('should return cached models if available', async () => {
      const mockModels = [{ id: 'model1', modelName: 'Model 1' }]
      ;(service as any).modelCache = { provider1: mockModels }

      const result = await service.getModels('provider1')

      expect(result).toEqual(mockModels)
    })

    it('should fetch models if not cached', async () => {
      const mockModels = {
        provider1: {
          providerName: 'Provider 1',
          apiKey: 'key1',
          models: [{ model_name: 'model1', display_name: 'Model 1' }],
        },
      }
      ;(KeywordsService.prototype.fetchModels as jest.Mock).mockResolvedValue(
        mockModels
      )

      const result = await service.getModels('provider1')

      expect(result).toEqual([
        {
          id: 'model1',
          modelName: 'model1',
          displayName: 'Model 1',
          model_name: 'model1',
          display_name: 'Model 1',
        },
      ])
    })
  })

  describe('generateText', () => {
    it('should generate text successfully', async () => {
      const mockOpenAI = { chat: jest.fn().mockReturnValue('gpt-3.5-turbo') }
      ;(createOpenAI as jest.Mock).mockReturnValue(mockOpenAI)
      const mockGenerateText = jest
        .fn()
        .mockResolvedValue({ text: 'Generated text' })
      jest.requireMock('ai').generateText = mockGenerateText

      const request = { model: 'gpt-3.5-turbo', prompt: 'Hello' }
      const extraMetadata = {
        provider: 'openai',
        apiKey: 'key1',
        customer_identifier: 'customer1',
      }

      const result = await service.generateText(request, extraMetadata)

      expect(result).toBe('Generated text')
      expect(createOpenAI).toHaveBeenCalled()
      expect(mockGenerateText).toHaveBeenCalled()
    })
  })

  describe('streamText', () => {
    it('should stream text successfully', async () => {
      const mockOpenAI = { chat: jest.fn().mockReturnValue('gpt-3.5-turbo') }
      ;(createOpenAI as jest.Mock).mockReturnValue(mockOpenAI)
      const mockStreamText = jest.fn().mockResolvedValue({
        textStream: (async function* () {
          yield 'Hello'
          yield ' '
          yield 'World'
        })(),
      })
      jest.requireMock('ai').streamText = mockStreamText

      const request = { model: 'gpt-3.5-turbo', prompt: 'Hello' }
      const extraMetadata = {
        provider: 'openai',
        apiKey: 'key1',
        customer_identifier: 'customer1',
      }

      const generator = service.streamText(request, extraMetadata)
      const result = []
      for await (const chunk of generator) {
        result.push(chunk)
      }

      expect(result).toEqual([
        { choices: [{ delta: { content: '<START>' } }] },
        { choices: [{ delta: { content: 'Hello' } }] },
        { choices: [{ delta: { content: ' ' } }] },
        { choices: [{ delta: { content: 'World' } }] },
      ])
      expect(createOpenAI).toHaveBeenCalled()
      expect(mockStreamText).toHaveBeenCalled()
    })
  })

  describe('generateObject', () => {
    it('should generate object successfully', async () => {
      const mockOpenAI = { chat: jest.fn().mockReturnValue('gpt-3.5-turbo') }
      ;(createOpenAI as jest.Mock).mockReturnValue(mockOpenAI)

      const schema = z.object({
        key: z.string(),
      })

      const mockGenerateObject = jest.fn().mockResolvedValue({
        object: { key: 'value' },
        finishReason: 'stop',
        usage: { promptTokens: 10, completionTokens: 20 },
      } as GenerateObjectResult<z.infer<typeof schema>>)

      jest.requireMock('ai').generateObject = mockGenerateObject

      const request: GenerateObjectRequest<z.infer<typeof schema>> = {
        model: 'gpt-3.5-turbo',
        prompt: 'Generate an object',
        schema: schema,
      }
      const extraMetadata = {
        provider: 'openai',
        apiKey: 'key1',
        customer_identifier: 'customer1',
      }

      const result = await service.generateObject(request, extraMetadata)

      expect(result).toEqual({
        object: { key: 'value' },
        finishReason: 'stop',
        usage: { promptTokens: 10, completionTokens: 20 },
      })
      expect(createOpenAI).toHaveBeenCalled()
      expect(mockGenerateObject).toHaveBeenCalled()
    })
  })

  describe('streamObject', () => {
    it('should stream object successfully', async () => {
      const mockOpenAI = { chat: jest.fn().mockReturnValue('gpt-3.5-turbo') }
      ;(createOpenAI as jest.Mock).mockReturnValue(mockOpenAI)

      const schema = z.object({
        partial: z.string(),
      })

      const mockStreamObject = jest.fn().mockResolvedValue({
        partialObjectStream: (async function* () {
          yield { partial: 'part1' }
          yield { partial: 'part2' }
          yield { partial: 'part3' }
        })(),
      })
      jest.requireMock('ai').streamObject = mockStreamObject

      const request: StreamObjectRequest<z.infer<typeof schema>> = {
        model: 'gpt-3.5-turbo',
        prompt: 'Stream an object',
        schema: schema,
      }
      const extraMetadata = {
        provider: 'openai',
        apiKey: 'key1',
        customer_identifier: 'customer1',
      }

      const generator = await service.streamObject(request, extraMetadata)

      // Ensure the return type matches StreamObjectReturn<T>
      expect(generator).toHaveProperty('next')
      expect(generator).toHaveProperty('throw')
      expect(generator).toHaveProperty('return')
      expect(generator[Symbol.asyncIterator]).toBeDefined()

      const result = []
      for await (const chunk of generator) {
        result.push(chunk)
      }

      expect(result).toEqual([
        { choices: [{ delta: { content: { partial: 'part1' } } }] },
        { choices: [{ delta: { content: { partial: 'part2' } } }] },
        { choices: [{ delta: { content: { partial: 'part3' } } }] },
      ])
      expect(createOpenAI).toHaveBeenCalled()
      expect(mockStreamObject).toHaveBeenCalled()
    })
  })
})
