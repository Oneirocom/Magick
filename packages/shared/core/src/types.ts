import {
  Application,
  Application as FeathersApplication,
  Koa,
} from '@feathersjs/koa'
import PubSub from 'pubsub-js'
import {
  Connection,
  Input,
  Node,
  NodeEditor,
  Output,
  Socket,
  Data,
  InputsData,
  NodeData,
  OutputsData,
  WorkerOutputs,
} from 'shared/rete'
import { MagickComponent } from './engine'
import { MagickConsole } from './plugins/consolePlugin/MagickConsole'
import { Inspector } from './plugins/inspectorPlugin/Inspector'
import { ModuleManager } from './plugins/modulePlugin/module-manager'
import { Task, TaskOutputTypes, TaskStore } from './plugins/taskPlugin/task'
import { SocketNameType, SocketType } from './sockets'

import { DataControl } from './plugins/inspectorPlugin'
import { SpellInterface } from '../../../server/core/src/schemas'
import { SpellManager } from './spellManager'
import { ExtendedStore } from 'client/state'

export { MagickComponent } from './engine'
export type { InspectorData } from './plugins/inspectorPlugin/Inspector'
export * from '../../../server/core/src/schemas'

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
  rawData?: string
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
  projectId?: string
  $limit?: number
}

export type GetVectorEventArgs = {
  type: string
  entities: string[]
  $limit?: number
}

export type EventResponse = Event[]

export type OnSubspellUpdated = (spell: SpellInterface) => void

export type ControlData = {
  dataKey: string
  name: string
  component: string
  data: ComponentData
  options: Record<string, unknown>
  id: string | null
  icon: string
  type: string
  placeholder: string
  tooltip?: string
}

export class MagickEditor extends NodeEditor<EventsTypes> {
  declare tabMap: Record<string, MagickEditor>
  isHighlighted = false
  declare getTask: (nodeId: number) => Task
  declare getTasks: () => TaskStore
  declare resetHighlights: () => void
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
  declare store: ExtendedStore
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
}) => Promise<SpellInterface | null>

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
  getSpell: GetSpell
  processCode?: ProcessCode
}

export type PubSubEvents = {
  ADD_SUBSPELL: string
  UPDATE_SUBSPELL: string
  DELETE_SUBSPELL: string
  OPEN_TAB: string
  TOGGLE_SNAP: string
  RUN_AGENT: string
  SEND_COMMAND: string
  TOGGLE_FILE_DRAWER: string
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
  sendToPlaytest: (data: string) => void
  sendToInspector: PublishEditorEvent
  sendToDebug: PublishEditorEvent
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
  name: string
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
  _task?: Task
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
  nodeId: number
  key: string
}

export type TaskOutput = {
  type: TaskOutputTypes
  task: Task
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

type HandlerResponse = {
  success: boolean
  result: string | number[]
  error: string
}

export type CompletionProvider = {
  [x: string]: any
  type: CompletionType
  subtype:
    | ImageCompletionSubtype
    | TextCompletionSubtype
    | AudioCompletionSubtype
    | DatabaseCompletionSubtype
    | SearchCompletionSubtype
  handler?: (attrs: {
    node: WorkerData
    inputs: MagickWorkerInputs
    outputs: MagickWorkerOutputs
    context: unknown
  }) => Promise<HandlerResponse> | HandlerResponse // server only
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

type Spell = {
  id: string
  name: string
  projectId: string
  hash: string
  createdAt: string
  updatedAt: string
  graph: {
    id: string
    nodes: Record<string, NodeData>
    comments?: []
  }
}

export type ModuleContext = {
  context: EngineContext
  spellManager: SpellManager
  app: Application
  agent?: any
  module: {
    secrets?: Record<string, string>
    publicVariables?: Record<string, string>
    app?: Application
    inputs: Record<string, unknown>
    outputs: Record<string, unknown>
    sessionId?: string
    isPlaytest?: boolean
  }
  projectId: string
  currentSpell: Spell
  data: {
    [key: string]: unknown
  }
  socketInfo: {
    targetSocket: string
    targetNode: MagickNode
  }
}

export type CompletionHandlerInputData = {
  node: NodeData
  inputs: MagickWorkerInputs
  outputs: MagickWorkerOutputs
  context: ModuleContext
}

export type MessagingRequest = unknown

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
  nodeId?: number
  customModel?: string
}

export type RequestData = {
  spell: string
  projectId: string
  nodeId: number
}

export type AppService = (app: FeathersApplication) => void

// todo this is deprecated and needs to be checked and removed
export interface MagickTask extends Task {
  outputs?: { [key: string]: string }
  init?: (task?: Task, node?: MagickNode) => void
}

export interface ModuleOptions {
  nodeType: 'input' | 'output' | 'triggerIn' | 'triggerOut' | 'module'
  socket?: Socket
  skip?: boolean
  /**
   * Hides the socket from the parent node
   */
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
