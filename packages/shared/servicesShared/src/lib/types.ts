import { RedisPubSub } from '@magickml/redis-pubsub'
import {
  CompletionResponse,
  CompletionRequest,
  Chunk,
  Message,
} from './coreLLMService/types/liteLLMTypes'
import { Model } from './coreLLMService/types/models'
import pino from 'pino'

export interface IBudgetManagerService {
  // Creates a budget for a user
  create_budget(
    total_budget: number,
    user: string,
    duration: 'daily' | 'weekly' | 'monthly' | 'yearly',
    created_at?: number
  ): Promise<void>
  // Computes the projected cost for a session
  projected_cost(model: string, messages: any[], user: string): Promise<number>
  // Returns the total budget of a user
  get_total_budget(user: string): Promise<number>
  // Updates the user's cost based on the completion object
  update_cost(user: string, completion_obj: any): Promise<void>
  // Returns the current cost of a user
  get_current_cost(user: string): Promise<number>
  // Returns the model cost of a user
  get_model_cost(user: string): Promise<Record<string, number>>
  // Checks if a user is valid
  is_valid_user(user: string): Promise<boolean>
  // Returns a list of all users
  get_users(): Promise<string[]>
  // Resets the cost of a user
  reset_cost(user: string): Promise<void>
  // Resets the cost of a user based on the duration
  reset_on_duration(user: string): Promise<void>
  // Updates the budget for all users
  update_budget_all_users(): Promise<void>
  // Stores the user dictionary
  save_data(): Promise<void>
}

export enum BudgetDuration {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
}

export type CreateBudgetParams = {
  totalBudget: number
  projectId: string
  duration: BudgetDuration
}

export type ProviderData = Record<
  string,
  {
    models: Model[]
    apiKey: string
    providerName: string
  }
>
export interface ICoreBudgetManagerService {
  initialize(): Promise<void>
  createBudget(params: CreateBudgetParams): Promise<boolean>
  projectedCost({
    model,
    messages,
    projectId,
  }: {
    model: string
    messages: Message[]
    projectId: string
  }): Promise<number>
  getTotalBudget(projectId: string): Promise<number>
  updateCost(
    projectId: string,
    completionObj: CompletionResponse
  ): Promise<boolean>
  getCurrentCost(projectId: string): Promise<number>
  getModelCost(projectId: string): Promise<Record<string, number>>
  isValidUser(projectId: string): Promise<boolean>
  getUsers(): Promise<string[]>
  resetCost(projectId: string): Promise<boolean>
  resetOnDuration(projectId: string): Promise<boolean>
  updateBudgetAllUsers(): Promise<boolean>
  saveData(): Promise<boolean>
}

export type CompletionParams = {
  request: CompletionRequest
  callback: (
    chunk: Chunk | null,
    isDone: boolean,
    completionResponse: CompletionResponse | null
  ) => void
  maxRetries: number
  spellId: string
  delayMs?: number
}

export interface ICoreLLMService {
  /**
   * Handles completion requests in streaming mode. Accumulates the text from each chunk and returns the complete text.
   *
   * @param request The completion request parameters.
   * @param callback A callback function that receives each chunk of text and a flag indicating if the streaming is done.
   * @returns A promise that resolves to the complete text after all chunks have been received.
   */
  completionGenerator: (
    params: CompletionParams
  ) => AsyncGenerator<Chunk, CompletionResponse, undefined>
  initialize: () => Promise<void>
}

export type SeraphRequest = {
  message: string
  systemPrompt?: string
}

export type SeraphFunction = {
  name: string
  messageTitle: string
  message: string
  icon?: JSX.Element
  result?: string
  startedAt?: string
  finishedAt?: string
}

export enum SeraphEvents {
  request = 'request',
  error = 'error',
  message = 'message',
  info = 'info',
  token = 'token',
  functionExecution = 'functionExecution',
  functionResult = 'functionResult',
  middlewareExecution = 'middlewareExecution',
  middlewareResult = 'middlewareResult',
}

export type SeraphEventTypes = {
  request?: SeraphRequest
  functionExecution?: SeraphFunction
  functionResult?: SeraphFunction
  middlewareExecution?: SeraphFunction
  middlewareResult?: SeraphFunction
  message?: string
  token?: string
  error?: string
  info?: string
}

export interface ISeraphEvent {
  id?: string
  agentId: string
  projectId: string
  spellId?: string
  type: SeraphEvents
  data: SeraphEventTypes
  createdAt: string
}

export type EventFormat<
  Data = Record<string, unknown>,
  Y = Record<string, unknown>
> = {
  plugin?: string
  content: string
  sender: string
  channel: string
  entities?: any[]
  rawData: unknown
  channelType: string
  observer: string
  client: string
  isPlaytest?: boolean
  spellId?: string
  data: Data
  metadata?: Y
  status?: 'success' | 'error' | 'pending' | 'unknown'
}

export type EventPayload<T = any, Y = any> = {
  connector: string
  eventName: string
  status: 'success' | 'error' | 'pending' | 'unknown'
  content: string
  sender: string
  observer: string
  client: string
  channel: string
  plugin: string
  agentId: string
  isPlaytest?: boolean
  spellId?: string
  skipSave?: boolean
  // entities: any[]
  channelType: string
  skipPersist?: boolean
  rawData: string
  timestamp: string
  stateKey?: string
  runInfo?: {
    spellId: string
  }
  data: T
  metadata: Y
}

export interface ActionPayload<T = unknown, Y = unknown> {
  actionName: string
  event: EventPayload<T, Y>
  skipSave?: boolean
  data: any
}

export interface ISharedAgent {
  id: string
  projectId: string
  pubsub: RedisPubSub
  logger: pino.Logger
  pluginManager: any // Use 'any' for now, we'll refine this later
  error: (message: string, data?: any) => void
  log: (message: string, data?: any) => void
  publishEvent: (event: any, data: any) => void
  emit: (event: any, data: any) => void
  on: (event: any, listener: (data: any) => void) => void
  app: any // Consider defining a more specific type for 'app' if possible
  spellbook: any
  [key: string]: any // Allow for additional properties
}

export const CORE_DEP_KEYS = {
  ACTION_SERVICE: 'coreActionService',
  AGENT: 'agent',
  BUDGET_MANAGER_SERVICE: 'coreBudgetManagerService',
  DOWNLOAD_FILE: 'downloadFile',
  EVENT_STORE: 'IEventStore',
  GET_SECRET: 'getSecret',
  GET_STATE: 'getState',
  I_VARIABLE_SERVICE: 'IVariableService',
  IMAGE_SERVICE: 'coreImageService',
  LLM_SERVICE: 'coreLLMService',
  LOGGER: 'ILogger',
  MEMORY_SERVICE: 'coreMemoryService',
  MEMORY_STREAM_SERVICE: 'memoryStreamService',
  STATE_SERVICE: 'IStateService',
  EMBEDDER_CLIENT: 'embedderClient',
  UPLOAD_FILE: 'uploadFile',
} as const
