import { SpellInterface } from '@magickml/core'

export interface Spells {
  data: SpellInterface[]
  total: number
  limit: number
  skip: number
}

export interface Conversation {
  id: number
  name: string
  spell: SpellInterface
  messages: Message[]
  prompt?: string
}

export interface OpenAIModel {
  id: string
  name: string
}

export interface Message {
  role: Role
  content: string
}

export type Role = 'assistant' | 'user'

export interface ChatBody {
  spell: SpellInterface
  messages: Message[]
}

export interface KeyValuePair {
  key: string
  value: any
}

// keep track of local storage schema
export interface LocalStorage {
  conversationHistory: Conversation[]
  selectedConversation: Conversation
  theme: 'light' | 'dark'
}
