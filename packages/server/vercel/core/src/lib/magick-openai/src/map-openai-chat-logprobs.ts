import { LanguageModelV1LogProbs } from '@ai-sdk/provider'

type OpenAIChatLogProbs = {
  content:
    | {
        token: string
        logprob: number
        top_logprobs: Array<{
          token: string
          logprob: number
        }>
      }[]
    | null
}

export function mapOpenAIChatLogProbsOutput(
  logprobs: OpenAIChatLogProbs | null | undefined
): LanguageModelV1LogProbs | undefined {
  return (
    logprobs?.content?.map(({ token, logprob, top_logprobs }) => ({
      token,
      logprob,
      topLogprobs: top_logprobs
        ? top_logprobs.map(({ token, logprob }) => ({
            token,
            logprob,
          }))
        : [],
    })) ?? undefined
  )
}
