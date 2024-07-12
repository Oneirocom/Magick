import { ReactNode } from 'react'
import { createAI, getAIState } from 'ai/rsc'
import { generateText } from 'ai'
import { createOpenAI } from '../../../../../vercel/core/src/lib/magick-openai/src'

// NOTE: Use this provider to allow AI/UI State Management for generative UI Tool calls
export type ServerMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type ClientMessage = {
  id: string
  role: 'user' | 'assistant'
  display: ReactNode
}

export type AIState = ServerMessage[]
export type UIState = ClientMessage[]

export async function sendMessage(message: string) {
  'use server'

  const history = getAIState() as ServerMessage[]

  const openai = createOpenAI({
    baseURL: process.env['KEYWORDS_API_URL'],
    apiKey: process.env['KEYWORDS_API_KEY'],
    extraMetaData: {},
  })

  const response = await generateText({
    model: openai('gpt-3.5-turbo'),
    messages: [...history, { role: 'user', content: message }],
  })

  return response
}

// Create the AI provider with the initial states and allowed actions
export const AIUIProvider = createAI<AIState, UIState>({
  initialAIState: [],
  initialUIState: [],
  actions: {
    sendMessage,
  },
})
