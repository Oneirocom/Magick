import PubSub from 'pubsub-js'
import { Connection, Input, Node, NodeEditor, Output, Socket } from 'rete'
import {
  Data,
  InputsData,
  NodeData,
  OutputsData,
  WorkerOutputs,
} from 'rete/types/core/data'
import { MagickComponent } from './engine'
import { MagickConsole } from './plugins/consolePlugin/MagickConsole'
import { Inspector } from './plugins/inspectorPlugin/Inspector'
import { ModuleManager } from './plugins/modulePlugin/module-manager'
import { Task, TaskOutputTypes } from './plugins/taskPlugin/task'
import { SocketNameType, SocketType } from './sockets'
import { Application as FeathersApplication, Koa } from '@feathersjs/koa'

import { TaskSocketInfo } from './plugins/taskPlugin/task'
import { SpellInterface } from './schemas'
import { DataControl } from './plugins/inspectorPlugin'
import { SpellManager } from './spellManager'

import io from 'socket.io'

export { MagickComponent } from './engine'

export type { InspectorData } from './plugins/inspectorPlugin/Inspector'

export * from './schemas'

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
  owner?: string
  embedding?: number[]
  projectId?: string
  date?: string
}

export type CreateDocumentArgs = Document

export type GetDocumentArgs = Document & {
  maxCount?: number
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
  projectId?: string
  agentId?: number | string
  date?: string
}

export type SemanticSearch = {
  concept?: string
  positive?: string
  negative?: string
  distance?: number
  positive_distance?: number
  negative_distance?: number
}

export type QAArgs = {
  question: string
  agentId: string
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
  projectId?: string
  maxCount?: number
}

export type GetVectorEventArgs = {
  type: string
  entities: string[]
  maxCount?: number
}

export type EventResponse = Event[]

export type CompletionBody = {
  prompt: string
  modelName: string
  maxTokens: number
  temperature: number
  topP: number
  presencePenalty: number
  frequencyPenalty: number
  // TODO: Type not used anywhere
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stop: any
  apiKey?: string
}

export type CompletionResponse = {
  // TODO: Type not used anywhere
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  success: any
  // TODO: Type not used anywhere
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  choice: any
}

export type OnSubspellUpdated = (spell: SpellInterface) => void

export class MagickEditor extends NodeEditor<EventsTypes> {
  declare tasks: Task[]
  declare currentSpell: SpellInterface
  declare pubSub: PubSubContext
  declare context: EditorContext
  declare tab: { type: string }
  declare abort: unknown
  declare loadGraph: (graph: Data, reloading?: boolean) => Promise<void>
  declare loadSpell: (
    spell: SpellInterface,
    reloading?: boolean
  ) => Promise<void>
  declare moduleManager: ModuleManager
  declare runProcess: (callback?: () => void | undefined) => Promise<void>
  declare onSpellUpdated: (
    spellName: string,
    callback: (spell: SpellInterface) => void
  ) => () => void
  declare refreshEventTable: () => void
}

export type Env = {
  API_ROOT_URL: string
}

export type UnknownData = Record<string, unknown>
export type UnknownSpellData = UnknownData

export type runSpellType<DataType = UnknownSpellData> = {
  inputs: MagickSpellInput
  spellId: string
  projectId: string
  secrets: Record<string, string>
  publicVariables: DataType
}
export type SupportedLanguages = 'python' | 'javascript'

export type GetSpell = ({
  spellName,
  projectId,
}: {
  spellName: string
  projectId: string
}) => Promise<SpellInterface>

export type ProcessCode = (
  code: unknown,
  inputs: MagickWorkerInputs,
  data: UnknownSpellData,
  language?: SupportedLanguages
) => unknown | void

export type RunSpell<DataType = Record<string, unknown>> = ({
  inputs,
  spellId,
  projectId,
  secrets,
  publicVariables,
}: runSpellType<DataType>) => Promise<DataType>

export type EngineContext<DataType = Record<string, unknown>> = {
  runSpell: RunSpell<DataType>
  completion?: (body: CompletionBody) => Promise<CompletionResponse>
  getSpell: GetSpell
  processCode?: ProcessCode
}

export type PubSubEvents = {
  ADD_SUBSPELL: string
  UPDATE_SUBSPELL: string
  DELETE_SUBSPELL: string
  OPEN_TAB: string
  $SUBSPELL_UPDATED: (spellName: string) => string
  $TRIGGER: (tabId: string, nodeId?: number) => string
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
  $CREATE_DEBUG_CONSOLE: (tabId: string) => string
  $CREATE_CONSOLE: (tabId: string) => string
  $RUN_SPELL: (tabId: string) => string
  $PROCESS: (tabId: string) => string
  $EXPORT: (tabId: string) => string
  $UNDO: (tabId: string) => string
  $REDO: (tabId: string) => string
  $DELETE: (tabId: string) => string
  $MULTI_SELECT_COPY: (tabId: string) => string
  $MULTI_SELECT_PASTE: (tabId: string) => string
  $REFRESH_EVENT_TABLE: (tabId: string) => string
}

export interface PubSubContext {
  publish: (event: string, data?: PubSubData) => boolean
  // eslint-disable-next-line @typescript-eslint/ban-types
  subscribe(
    event: string,
    func: PubSubJS.SubscriptionListener<PubSubData>
  ): () => void
  PubSub: typeof PubSub
  events: PubSubEvents
}

export type PubSubData = Record<string, unknown> | string | unknown[]
export type PubSubCallback = (event: string, data: PubSubData) => void

export type OnInspectorCallback = (data: Record<string, unknown>) => void
export type OnInspector = (
  node: MagickNode,
  callback: OnInspectorCallback
) => () => void
export type OnEditorCallback = (data: PubSubData) => void
export type OnEditor = (callback: OnEditorCallback) => () => void
export type OnDebug = (
  spellname: string,
  callback: OnEditorCallback
) => () => void

export type PublishEditorEvent = (data: PubSubData) => void

export interface EditorContext extends EngineContext {
  /**
   * @deprecated The method should not be used
   */
  onTrigger: (
    node: MagickNode | string,
    callback: (data: unknown) => void
  ) => () => void
  sendToPlaytest: (data: string) => void
  sendToInspector: PublishEditorEvent
  sendToDebug: (message: unknown) => void
  onInspector: OnInspector
  onPlaytest: OnEditor
  onDebug: OnDebug
  clearTextEditor: () => void
  refreshEventTable: () => void
}

export type EventsTypes = {
  run: void
  save: void
  [key: string]: unknown
  //EventTypes from rete/types/events
  connectionpath: {
    points: number[]
    connection: Connection
    d: string
  }
  connectiondrop: Input | Output
  connectionpick: Input | Output
  resetconnection: void
}

export interface IRunContextEditor extends NodeEditor {
  context: EditorContext
  abort: () => void
}

export type TaskType = 'output' | 'option'
export type ConnectionType = 'input' | 'output'

export type DataSocketType = {
  name: SocketNameType
  taskType: TaskType
  socketKey: string
  connectionType: ConnectionType
  socketType: SocketType
  useSocketName: boolean
}

export type MagicNodeInput = Input & { socketType: DataSocketType }
export type MagicNodeOutput = Output & {
  taskType?: TaskType
  socketType: DataSocketType
}

export type MagickNode = Node & {
  inspector: Inspector
  display: (content: string) => void
  outputs: MagicNodeOutput[]
  data: WorkerData
  category?: string
  displayName?: string
  info: string
  subscription: PubSubCallback
  console: MagickConsole
}

export type ModuleType = {
  id: string
  name: string
  data: GraphData
  createdAt: string
  updatedAt: string
}

export type ModelCompletionOpts = {
  model?: string
  prompt?: string
  maxTokens?: number
  temperature?: number
  topP?: number
  n?: number
  stream?: boolean
  logprobs?: number
  echo?: boolean
  stop?: string | string[]
  presencePenalty?: number
  frequencyPenalty?: number
  bestOf?: number
  user?: string
  logitBias?: { [token: string]: number }
}

export type Subspell = { name: string; id: string; data: GraphData }

export type GraphData = Data

export type IgnoredList =
  | {
      name: string
    }[]
  | string[]

export type ComponentData<T = TaskType> = Record<string, unknown> & {
  ignored?: IgnoredList
  socketType?: SocketType
  taskType?: T
  icon?: string
}

export type InputComponentData = ComponentData<TaskType>
export type OutputComponentData = ComponentData<TaskType>

export type ModuleComponent = MagickComponent<unknown> & {
  run: (node: MagickNode, data?: unknown) => Promise<void>
}

export type NodeConnections = {
  node: number
  input?: string
  output?: string
  data: Record<string, unknown>
}

export type NodeOutputs = {
  [outputKey: string]: {
    connections: NodeConnections[]
  }
}

export type MagickNodeData = {
  socketKey?: string
  name?: string
  isInput?: boolean
  useDefault?: boolean
  defaultValue?: string
  element?: number
  [DataKey: string]: unknown
}

export type WorkerData = NodeData & {
  // outputs: DataSocketOutput
  // inputs: DataSocketInput
  spell?: string
  data?: MagickNodeData
  console?: MagickConsole
  [key: string]: unknown
}

export function AsDataSocket(data: InputsData | OutputsData): DataSocketType[] {
  return data as unknown as DataSocketType[]
}

export function AsInputsData(data: DataSocketType[]): InputsData {
  return data as unknown as InputsData
}

export function AsOutputsData(data: DataSocketType[]): OutputsData {
  return data as unknown as OutputsData
}

export function AsInputsAndOutputsData(
  data: DataSocketType[]
): InputsData & OutputsData {
  return data as unknown as InputsData & OutputsData
}

export type Module = { name: string; id: string; data: Data }

export type MagickSpellInput = Record<string, unknown>
export type MagickSpellOutput = Record<string, unknown>

export type NewSpellArgs = {
  name: string
  graph: Data
}

export type MagickReteInput = {
  type: TaskOutputTypes
  outputData: unknown
  task: MagickTask
  key: string
}

export type TaskOutput = {
  type: TaskOutputTypes
  task: MagickTask
  key: string
}

export type ModuleWorkerOutput = WorkerOutputs

export type MagickWorkerInput = string | unknown | MagickReteInput
export type MagickWorkerInputs = { [key: string]: MagickWorkerInput[] }
export type MagickWorkerOutputs = WorkerOutputs & {
  [key: string]: TaskOutput
}

// Go-inspired function return
export type GoFn = [
  boolean, // Ok
  string | null, // Message
  unknown // body
]

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

export type CompletionType = 'image' | 'text'

export type ImageCompletionSubtype = 'text2image' | 'image2image' | 'image2text'

export type TextCompletionSubtype = 'text' | 'embedding' | 'chat'

export type CompletionSocket = {
  socket: string
  name: string
  type: Socket
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DataControlImplementation extends DataControl {
  new (control: CompletionInspectorControls): DataControl
}

export type CompletionInspectorControls = {
  type: DataControlImplementation
  dataKey: string
  name: string
  icon: string
  defaultValue: string
}

export type CompletionProvider = {
  type: CompletionType
  subtype: ImageCompletionSubtype | TextCompletionSubtype
  handler?: (attrs: {
    node: WorkerData
    inputs: MagickWorkerInputs
    outputs: MagickWorkerOutputs
    context: unknown
  }) => { success: boolean; result: string; error: string } // server only
  inspectorControls?: CompletionInspectorControls[] // client only
  inputs: CompletionSocket[]
  outputs: CompletionSocket[]
  models: string[]
}

export type TextCompletionData = {
  model: string
  prompt: string
  temperature: number
  max_tokens: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
  stop: string[]
  apiKey?: string
}

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

export type CompletionHandlerInputData = {
  node: NodeData
  inputs: MagickWorkerInputs
  outputs: MagickWorkerOutputs
  context: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    module: any
    secrets: Record<string, string>
    projectId: string
    context: EngineContext
    currentSpell: SpellInterface
  }
}

export type MessagingRequest = unknown

export type RequestPayload = {
  projectId: string
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
  nodeId?: number
}

export type RequestData = {
  spell: string
  projectId: string
  nodeId: number
}

export type AppService = (app: FeathersApplication) => void
export interface MagickTask extends Task {
  outputs?: { [key: string]: string }
  init?: (task?: MagickTask, node?: MagickNode) => void
  onRun?: (
    node: NodeData,
    task: Task,
    data: unknown,
    socketInfo: TaskSocketInfo
  ) => void
}

export interface ModuleOptions {
  nodeType: 'input' | 'output' | 'triggerIn' | 'triggerOut' | 'module'
  socket?: Socket
  skip?: boolean
  hide?: boolean
}

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

export type UserSpellManager = Map<string, SpellManager>