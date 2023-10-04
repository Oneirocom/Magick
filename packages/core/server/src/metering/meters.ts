import { sendMeteringEvent } from './meteringClient'

type OpenAIMeterData = {
  projectId: string
  model: string
  totalTokens: number
}

type GoogleAIMeterData = {
  projectId: string
  model: string
  callCount: number
  wordCount: number
}

type CogMeterData = {
  projectId: string
  model: string
  durationMs: number
}

export async function trackOpenAIUsage(data: OpenAIMeterData) {
  console.log('trackOpenAIUsage', data)
  return await sendMeteringEvent({
    project_id: data.projectId,
    model: data.model,
    total_tokens: data.totalTokens,
    type: 'token_usage',
  })
}

export async function trackGoogleAIUsage(data: GoogleAIMeterData) {
  return await sendMeteringEvent({
    project_id: data.projectId,
    model: data.model,
    call_count: data.callCount,
    word_count: data.wordCount,
    type: 'token_usage',
  })
}
export async function trackCogUsage(data: CogMeterData) {
  return await sendMeteringEvent({
    project_id: data.projectId,
    model: data.model,
    duration_ms: data.durationMs,
    type: 'duration',
  })
}
