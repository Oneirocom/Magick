// seraph.test.ts
import { Seraph } from '../seraphCore'
import { CognitiveFunctionSchema } from '../zod_schemas'
import { LLMManager } from '../llm_manager'
import { SeraphIterator } from '../seraph_iterator'

jest.mock('../llm_manager')
jest.mock('../seraph_iterator')

describe('Seraph', () => {
  let seraph: Seraph
  let llmManager: LLMManager
  let mockSeraphIterator: jest.MockedClass<typeof SeraphIterator>

  beforeEach(() => {
    seraph = new Seraph('Test prompt')
    llmManager = new LLMManager('mock_api_key')
    const mockGenerateResponse = jest.fn().mockImplementation((...args) => {
      console.log('generateResponse called with arguments:', args)
      return Promise.resolve('Mock LLM response')
    })

    llmManager.generateResponse = mockGenerateResponse

    mockSeraphIterator = SeraphIterator as jest.MockedClass<
      typeof SeraphIterator
    >
    mockSeraphIterator.mockClear()

    seraph['cognitiveFunctionExecutor'].executeFunction = jest
      .fn()
      .mockResolvedValue('Function result')
  })

  afterEach(() => {
    // Clean up any side effects or reset state if necessary
  })

  test('should initialize with the provided prompt', () => {
    expect(seraph['prompt']).toBe('Test prompt')
  })

  test('should register a cognitive function', () => {
    const functionSchema: CognitiveFunctionSchema = {
      name: 'testFunction',
      description: 'A test function',
      parameters: {},
      examples: [],
    }
    seraph.registerCognitiveFunction(functionSchema)
    expect(seraph['cognitiveFunctions']['testFunction']).toBe(functionSchema)
  })

  test('should process user input and generate a response', async () => {
    const conversationId = 'test_conversation'
    const userInput = 'Hello, Seraph!'
    const mockIteratorResponse = 'Mocked iterator response'

    const mockIterator = {
      seraph,
      conversationId,
      response: userInput,
      done: false,
      llmManager,
      next: jest.fn().mockResolvedValue({
        done: false,
        value: mockIteratorResponse,
      }),
      [Symbol.asyncIterator]: jest.fn(() => ({
        next: mockIterator.next,
        [Symbol.asyncIterator]: mockIterator[Symbol.asyncIterator],
      })),
    }

    ;(
      SeraphIterator as jest.MockedClass<typeof SeraphIterator>
    ).mockImplementationOnce(() => mockIterator)

    const response = seraph.processInput(userInput, conversationId)
    const responseIterator = response[Symbol.asyncIterator]()
    const iteratorResult = await responseIterator.next()

    expect(iteratorResult.value).toBe(mockIteratorResponse)
    expect(iteratorResult.done).toBe(false)
    expect(SeraphIterator).toHaveBeenCalledWith(
      seraph,
      conversationId,
      expect.any(String)
    )
  })

  test('should add content to the prompt', () => {
    seraph.addToPrompt('Additional prompt')
    expect(seraph['prompt']).toBe('Test promptAdditional prompt')
  })

  test('should clear the prompt', () => {
    seraph.addToPrompt('Additional prompt')
    seraph.clearPrompt()
    expect(seraph['prompt']).toBe('')
  })

  test('should generate a response based on the prompt and context', () => {
    const conversationId = 'test_conversation'
    seraph.conversationManager.updateContext(conversationId, 'User message')
    const prompt = seraph.generatePrompt(conversationId)
    expect(prompt).toContain(
      'Generated response for conversation test_conversation'
    )
    expect(prompt).toContain('based on prompt: Test prompt')
    expect(prompt).toContain('Context: User message')
  })

  test('should process function output and update the response', () => {
    const functionOutput = 'Function output'
    const response = 'Initial response'
    const updatedResponse = seraph['processFunctionOutput'](
      functionOutput,
      response
    )

    expect(updatedResponse).toBe(
      'Initial response\n\nFunction output: Function output'
    )
  })

  test('should handle cognitive function execution error', async () => {
    const conversationId = 'test_conversation'
    const userInput = `Hello, Seraph! <function_calls>
      <invoke>
        <tool_name>testFunction</tool_name>
        <parameters>
          <param1>value1</param1>
        </parameters>
      </invoke>
    </function_calls>`
    const functionSchema: CognitiveFunctionSchema = {
      name: 'testFunction',
      description: 'A test function',
      parameters: {
        param1: {
          type: 'string',
          description: 'Parameter 1',
        },
      },
      examples: [],
    }
    seraph.registerCognitiveFunction(functionSchema)

    const mockIterator = {
      seraph,
      conversationId,
      response: userInput,
      done: false,
      llmManager,
      next: jest
        .fn()
        .mockRejectedValueOnce(new Error('Function execution error')),
      [Symbol.asyncIterator]: jest.fn(() => ({
        next: mockIterator.next,
        [Symbol.asyncIterator]: mockIterator[Symbol.asyncIterator],
      })),
    }

    ;(
      SeraphIterator as jest.MockedClass<typeof SeraphIterator>
    ).mockImplementationOnce(() => mockIterator)

    const response = seraph.processInput(userInput, conversationId)
    const responseIterator = response[Symbol.asyncIterator]()

    await expect(responseIterator.next()).rejects.toThrow(
      'Function execution error'
    )
  })

  // Add more test cases for other edge cases and functionalities
})
