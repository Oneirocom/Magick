import { Application as FeathersApplication, Koa } from '@feathersjs/koa'
import PubSub from 'pubsub-js'
import { SpellInterface } from 'server/schemas'

export type ImageType = {
  id: string
  captionId: string
  imageCaption: string
  imageUrl: string
  tag: string
  score: number | string
}

export type ImageCacheResponse = {
  images: ImageType[]
}

export type Document = {
  id?: number
  type?: string
  content?: string
  embedding?: number[]
  projectId?: string
  date?: string
  distance?: number
}

export type CreateDocumentArgs = Document

export type GetDocumentArgs = Document & {
  $limit?: number
}

type AgentTaskStatus = 'active' | 'completed' | 'canceled'

export type CreateAgentTaskArgs = {
  status: AgentTaskStatus
  agentId?: string
  type: string
  objective: string
  eventData: Event
  projectId: string
  steps: string
}

export type AgentTask = {
  id: number
  agentId?: string
  status: AgentTaskStatus
  type: string
  objective: string
  eventData: Event
  projectId: string
  steps: string
}

export type AgentTaskData = {
  timestamp: number
  thought: string
  skill: string
  action: string
  result: string
}

export type Event = {
  id?: number
  type?: string
  content?: string
  sender?: string
  entities?: string[]
  observer?: string
  client?: string
  channel?: string
  channelType?: string
  connector?: string
  projectId?: string
  agentId?: number | string
  embedding?: number[]
  date?: string
  rawData?: unknown
}

export type CreateEventArgs = Event

export type GetEventArgs = {
  type?: string
  embedding?: string
  observer?: string
  client?: string
  //TODO: entities not used anywhere
  // entities?: any[]
  channel?: string
  channelType?: string
  connector?: string
  rawData?: string
  projectId: string
  $limit?: number
}

export type GetVectorEventArgs = {
  type: string
  entities: string[]
  $limit?: number
}

export type EventResponse = Event[]

export type Env = {
  API_ROOT_URL: string
}

export type UnknownData = Record<string, unknown>
export type UnknownSpellData = UnknownData
export type SupportedLanguages = 'python' | 'javascript'

export type PubSubEvents = {
  ADD_SUBSPELL: string
  UPDATE_SUBSPELL: string
  DELETE_SUBSPELL: string
  OPEN_TAB: string
  TOGGLE_SNAP: string
  RUN_AGENT: string
  SEND_COMMAND: string
  TOGGLE_FILE_DRAWER: string
  MESSAGE_AGENT: string
  RESET_NODE_STATE: string
  $SUBSPELL_UPDATED: (spellName: string) => string
  $TRIGGER: (tabId: string, nodeId?: number) => string
  $RESET_HIGHLIGHTS: (tabId: string) => string
  $PLAYTEST_INPUT: (tabId: string) => string
  $PLAYTEST_PRINT: (tabId: string) => string
  $DEBUG_PRINT: (tabId: string) => string
  $DEBUG_INPUT: (tabId: string) => string
  $INSPECTOR_SET: (tabId: string) => string
  $TEXT_EDITOR_SET: (tabId: string) => string
  $TEXT_EDITOR_CLEAR: (tabId: string) => string
  $CLOSE_EDITOR: (tabId: string) => string
  $NODE_SET: (tabId: string, nodeId: number) => string
  $SAVE_SPELL: (tabId: string) => string
  $SAVE_SPELL_DIFF: (tabId: string) => string
  $CREATE_MESSAGE_REACTION_EDITOR: (tabId: string) => string
  $CREATE_PLAYTEST: (tabId: string) => string
  $CREATE_INSPECTOR: (tabId: string) => string
  $CREATE_TEXT_EDITOR: (tabId: string) => string
  $CREATE_AGENT_CONTROLS: (tabId: string) => string
  $CREATE_DEBUG_CONSOLE: (tabId: string) => string
  $CREATE_CONSOLE: (tabId: string) => string
  $RUN_SPELL: (tabId?: string) => string
  $PROCESS: (tabId: string) => string
  $EXPORT: (tabId: string) => string
  $UNDO: (tabId: string) => string
  $REDO: (tabId: string) => string
  $DELETE: (tabId: string) => string
  $MULTI_SELECT_COPY: (tabId: string) => string
  $MULTI_SELECT_PASTE: (tabId: string) => string
  $REFRESH_EVENT_TABLE: (tabId: string) => string
  $RUN_AGENT: (tabId: string) => string
}

export type RequestPayload = {
  projectId: string
  agentId: string
  requestData: string
  responseData?: string
  model: string
  startTime: number
  status?: string
  statusCode?: number
  parameters?: string
  provider?: string
  type?: string
  hidden?: boolean
  processed?: boolean
  totalTokens?: number
  spell?: SpellInterface
  nodeId?: number | null
  customModel?: string
  cost?: number
}

export interface PubSubContext {
  publish: (event: string, data?: PubSubData) => boolean
  // eslint-disable-next-line @typescript-eslint/ban-types
  subscribe(event: string, func: PubSubJS.SubscriptionListener<any>): () => void
  PubSub: typeof PubSub
  events: PubSubEvents
}

export type PubSubData = Record<string, unknown> | string | unknown[]
export type PubSubCallback = (event: string, data: PubSubData) => void

export type OnInspectorCallback = (data: Record<string, unknown>) => void

export type OnEditorCallback = (data: PubSubData) => void
export type OnEditor = (callback: OnEditorCallback) => () => void
export type OnDebug = (
  spellname: string,
  callback: OnEditorCallback
) => () => void

export type PublishEditorEvent = (data: PubSubData) => void

export type IgnoredList =
  | {
      name: string
    }[]
  | string[]

// Elixir-inspired function return
export type ExFn = [true, unknown] | [false, string]

export type SearchSchema = {
  title: string
  description: string
}

export type ClassifierSchema = {
  type: string
  examples: string[] | string
}

export type MessagingWebhookBody = {
  MessageSid: string
  Body: string
  From: string
  To: string
}

export type CompletionType = 'image' | 'text' | 'audio' | 'database' | 'search'

export type ImageCompletionSubtype = 'text2image' | 'image2image' | 'image2text'

export type TextCompletionSubtype = 'text' | 'embedding' | 'chat' | 'typeChat'

export type AudioCompletionSubtype = 'text2speech' | 'text2audio'

export type SearchCompletionSubtype = 'search'

export type DatabaseCompletionSubtype =
  | 'select'
  | 'update'
  | 'upsert'
  | 'insert'
  | 'delete'

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant' | string
  content: string
}

export type ChatCompletionData = {
  model: string
  systemMessage: string
  conversationMessages: ChatMessage[]
  userMessage: string
  temperature: number
  max_tokens: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
  stop: string[]
  apiKey?: string
}

export type EmbeddingData = {
  input: string
  model?: string
  apiKey: string
}

export type MessagingRequest = unknown

export type RequestData = {
  spell: string
  projectId: string
  nodeId: number
}

export type GraphEventPayload = {
  sender: string
  agentId: string
  connector: string
  connectorData: string
  observer: string
  content: string
  eventType: string
  event: Event
}

export type AppService = (app: FeathersApplication) => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Middleware = (ctx: Koa.Context, next: any) => any

export type Method =
  | 'get'
  | 'head'
  | 'post'
  | 'put'
  | 'delete'
  | 'connect'
  | 'options'
  | 'trace'
  | 'patch'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handler = (ctx: Koa.Context) => any

export type Route = {
  method?: Method
  path: string
  middleware?: Middleware[]
  handler?: Handler
  get?: Handler
  put?: Handler
  post?: Handler
  del?: Handler
  delete?: Handler
  head?: Handler
  patch?: Handler
}
