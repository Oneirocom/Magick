import { sendMeteringEvent } from './meteringClient'

type OpenAIMeterData = {
  projectId: string
  totalTokens: number
  model: string
}

type GoogleAIMeterData = {
  projectId: string
  totalTokens: number
  model: string
}

type CogMeterData = {
  projectId: string
  durationMs: number
  model: string
}



export async function trackOpenAIUsage(data: OpenAIMeterData) {
  return await sendMeteringEvent(data.projectId, data.model, data.totalTokens)
}

export async function trackGoogleAIUsage(data: GoogleAIMeterData) {
  return await sendMeteringEvent(data.projectId, data.model, data.totalTokens)
}

export async function trackCogUsage(data: CogMeterData) {
  return await sendMeteringEvent(data.projectId, data.model, undefined, data.durationMs)
}
