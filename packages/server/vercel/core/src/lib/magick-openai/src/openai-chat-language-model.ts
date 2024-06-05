import {
  InvalidResponseDataError,
  LanguageModelV1,
  LanguageModelV1FinishReason,
  LanguageModelV1LogProbs,
  LanguageModelV1StreamPart,
  UnsupportedFunctionalityError,
} from '@ai-sdk/provider'
import {
  ParseResult,
  createEventSourceResponseHandler,
  createJsonResponseHandler,
  generateId,
  isParseableJson,
  postJsonToApi,
} from '@ai-sdk/provider-utils'
import { z } from 'zod'
import { convertToOpenAIChatMessages } from './convert-to-openai-chat-messages'
import { mapOpenAIChatLogProbsOutput } from './map-openai-chat-logprobs'
import { mapOpenAIFinishReason } from './map-openai-finish-reason'
import { OpenAIChatModelId, OpenAIChatSettings } from './openai-chat-settings'
import { openaiFailedResponseHandler } from './openai-error'

type OpenAIChatConfig = {
  provider: string
  baseURL: string
  compatibility: 'strict' | 'compatible'
  headers: () => Record<string, string | undefined>
}

export class OpenAIChatLanguageModel implements LanguageModelV1 {
  readonly specificationVersion = 'v1'
  readonly defaultObjectGenerationMode = 'tool'

  readonly modelId: OpenAIChatModelId
  readonly settings: OpenAIChatSettings

  private readonly config: OpenAIChatConfig
  private readonly extraMetaData?: Record<string, any>

  constructor(
    modelId: OpenAIChatModelId,
    settings: OpenAIChatSettings,
    config: OpenAIChatConfig,
    extraMetaData?: Record<string, any>
  ) {
    this.modelId = modelId
    this.settings = settings
    this.config = config
    this.extraMetaData = extraMetaData ?? {}
  }

  get provider(): string {
    return this.config.provider
  }

  private getArgs({
    mode,
    prompt,
    maxTokens,
    temperature,
    topP,
    frequencyPenalty,
    presencePenalty,
    seed,
  }: Parameters<LanguageModelV1['doGenerate']>[0]) {
    const type = mode.type

    const baseArgs = {
      // model id:
      model: this.modelId,

      // model specific settings:
      logit_bias: this.settings.logitBias,
      logprobs:
        this.settings.logprobs === true ||
        typeof this.settings.logprobs === 'number',
      top_logprobs:
        typeof this.settings.logprobs === 'number'
          ? this.settings.logprobs
          : typeof this.settings.logprobs === 'boolean'
          ? this.settings.logprobs
            ? 0
            : undefined
          : undefined,
      user: this.settings.user,

      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      seed,

      // messages:
      messages: convertToOpenAIChatMessages(prompt),

      // extra meta data:
      ...this.extraMetaData,
    }

    switch (type) {
      case 'regular': {
        return { ...baseArgs, ...prepareToolsAndToolChoice(mode) }
      }

      case 'object-json': {
        return {
          ...baseArgs,
          response_format: { type: 'json_object' },
        }
      }

      case 'object-tool': {
        return {
          ...baseArgs,
          tool_choice: { type: 'function', function: { name: mode.tool.name } },
          tools: [
            {
              type: 'function',
              function: {
                name: mode.tool.name,
                description: mode.tool.description,
                parameters: mode.tool.parameters,
              },
            },
          ],
        }
      }

      case 'object-grammar': {
        throw new UnsupportedFunctionalityError({
          functionality: 'object-grammar mode',
        })
      }

      default: {
        const _exhaustiveCheck: never = type
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`)
      }
    }
  }

  async doGenerate(
    options: Parameters<LanguageModelV1['doGenerate']>[0]
  ): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>> {
    const args = this.getArgs(options)

    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/chat/completions`,
      headers: this.config.headers(),
      body: args,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        openAIChatResponseSchema
      ),
      abortSignal: options.abortSignal,
    })

    const { messages: rawPrompt, ...rawSettings } = args
    const choice = response.choices[0]

    return {
      text: choice.message.content ?? undefined,
      toolCalls: choice.message.tool_calls?.map(toolCall => ({
        toolCallType: 'function',
        toolCallId: toolCall.id ?? generateId(),
        toolName: toolCall.function.name,
        args: toolCall.function.arguments!,
      })),
      finishReason: mapOpenAIFinishReason(choice.finish_reason),
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
      },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings: [],
      logprobs: mapOpenAIChatLogProbsOutput(choice.logprobs as any),
    }
  }

  async doStream(
    options: Parameters<LanguageModelV1['doStream']>[0]
  ): Promise<Awaited<ReturnType<LanguageModelV1['doStream']>>> {
    const args = this.getArgs(options)

    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/chat/completions`,
      headers: this.config.headers(),
      body: {
        ...args,

        stream: true,

        // only include stream_options when in strict compatibility mode:
        stream_options:
          this.config.compatibility === 'strict'
            ? { include_usage: true }
            : undefined,
      },
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        openaiChatChunkSchema
      ),
      abortSignal: options.abortSignal,
    })

    const { messages: rawPrompt, ...rawSettings } = args

    const toolCalls: Array<{
      id: string
      type: 'function'
      function: {
        name: string
        arguments: string
      }
    }> = []

    let finishReason: LanguageModelV1FinishReason = 'other'
    let usage: { promptTokens: number; completionTokens: number } = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN,
    }
    let logprobs: LanguageModelV1LogProbs

    return {
      stream: response.pipeThrough(
        new TransformStream<
          ParseResult<z.infer<typeof openaiChatChunkSchema>>,
          LanguageModelV1StreamPart
        >({
          transform(chunk, controller) {
            if (!chunk.success) {
              controller.enqueue({
                type: 'error',
                error: 'Failed to parse chunk',
              })
              return
            }

            const value = chunk.value

            if (value.usage != null) {
              usage = {
                promptTokens: value.usage.prompt_tokens,
                completionTokens: value.usage.completion_tokens,
              }
            }

            const choice = value.choices[0]

            if (choice?.finish_reason != null) {
              finishReason = mapOpenAIFinishReason(choice.finish_reason)
            }

            if (choice?.delta == null) {
              return
            }

            const delta = choice.delta

            if (delta.content != null) {
              controller.enqueue({
                type: 'text-delta',
                textDelta: delta.content,
              })
            }

            const mappedLogprobs = choice.logprobs
              ? mapOpenAIChatLogProbsOutput(choice.logprobs as any)
              : undefined
            if (mappedLogprobs?.length) {
              if (logprobs === undefined) logprobs = []
              logprobs.push(...mappedLogprobs)
            }

            if (delta.tool_calls != null) {
              for (const toolCallDelta of delta.tool_calls) {
                const index = toolCallDelta.index

                // Tool call start. OpenAI returns all information except the arguments in the first chunk.
                if (toolCalls[index] == null) {
                  if (toolCallDelta.type !== 'function') {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function' type.`,
                    })
                  }

                  if (toolCallDelta.id == null) {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'id' to be a string.`,
                    })
                  }

                  if (toolCallDelta.function?.name == null) {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function.name' to be a string.`,
                    })
                  }

                  toolCalls[index] = {
                    id: toolCallDelta.id,
                    type: 'function',
                    function: {
                      name: toolCallDelta.function.name,
                      arguments: toolCallDelta.function.arguments ?? '',
                    },
                  }

                  continue
                }

                // existing tool call, merge
                const toolCall = toolCalls[index]

                if (toolCallDelta.function?.arguments != null) {
                  toolCall.function!.arguments +=
                    toolCallDelta.function?.arguments ?? ''
                }

                // send delta
                controller.enqueue({
                  type: 'tool-call-delta',
                  toolCallType: 'function',
                  toolCallId: toolCall.id,
                  toolName: toolCall.function.name,
                  argsTextDelta: toolCallDelta.function.arguments ?? '',
                })

                // check if tool call is complete
                if (
                  toolCall.function?.name == null ||
                  toolCall.function?.arguments == null ||
                  !isParseableJson(toolCall.function.arguments)
                ) {
                  continue
                }

                controller.enqueue({
                  type: 'tool-call',
                  toolCallType: 'function',
                  toolCallId: toolCall.id ?? generateId(),
                  toolName: toolCall.function.name,
                  args: toolCall.function.arguments,
                })
              }
            }
          },

          flush(controller) {
            controller.enqueue({
              type: 'finish',
              finishReason,
              logprobs,
              usage,
            })
          },
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings: [],
    }
  }
}

// limited version of the schema, focussed on what is needed for the implementation
// this approach limits breakages when the API changes and increases efficiency
const openAIChatResponseSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        role: z.literal('assistant'),
        content: z.string().nullable().optional(),
        tool_calls: z
          .array(
            z.object({
              id: z.string().optional().nullable(),
              type: z.literal('function'),
              function: z.object({
                name: z.string(),
                arguments: z.string(),
              }),
            })
          )
          .optional(),
      }),
      index: z.number(),
      logprobs: z
        .object({
          content: z
            .array(
              z.object({
                token: z.string(),
                logprob: z.number(),
                top_logprobs: z.array(
                  z.object({
                    token: z.string(),
                    logprob: z.number(),
                  })
                ),
              })
            )
            .nullable(),
        })
        .nullable()
        .optional(),
      finish_reason: z.string().optional().nullable(),
    })
  ),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
  }),
})

// limited version of the schema, focussed on what is needed for the implementation
// this approach limits breakages when the API changes and increases efficiency
const openaiChatChunkSchema = z.object({
  choices: z.array(
    z.object({
      delta: z.object({
        role: z.enum(['assistant']).optional(),
        content: z.string().nullable().optional(),
        tool_calls: z
          .array(
            z.object({
              index: z.number(),
              id: z.string().optional().nullable(),
              type: z.literal('function').optional(),
              function: z.object({
                name: z.string().optional(),
                arguments: z.string().optional(),
              }),
            })
          )
          .optional(),
      }),
      logprobs: z
        .object({
          content: z.array(
            z.object({
              token: z.string(),
              logprob: z.number(),
              top_logprobs: z.array(
                z.object({
                  token: z.string(),
                  logprob: z.number(),
                })
              ),
            })
          ),
        })
        .optional(),
      finish_reason: z.string().nullable().optional(),
      index: z.number(),
    })
  ),
  usage: z
    .object({
      prompt_tokens: z.number(),
      completion_tokens: z.number(),
    })
    .optional()
    .nullable(),
})

function prepareToolsAndToolChoice(
  mode: Parameters<LanguageModelV1['doGenerate']>[0]['mode'] & {
    type: 'regular'
  }
) {
  // when the tools array is empty, change it to undefined to prevent errors:
  const tools = mode.tools?.length ? mode.tools : undefined

  if (tools == null) {
    return { tools: undefined, tool_choice: undefined }
  }

  const mappedTools = tools.map(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }))

  const toolChoice = mode.toolChoice

  if (toolChoice == null) {
    return { tools: mappedTools, tool_choice: undefined }
  }

  const type = toolChoice.type

  switch (type) {
    case 'auto':
    case 'none':
    case 'required':
      return { tools: mappedTools, tool_choice: type }
    case 'tool':
      return {
        tools: mappedTools,
        tool_choice: {
          type: 'function',
          function: {
            name: toolChoice.toolName,
          },
        },
      }
    default: {
      const _exhaustiveCheck: never = type
      throw new Error(`Unsupported tool choice type: ${_exhaustiveCheck}`)
    }
  }
}
