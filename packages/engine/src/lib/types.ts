import { Connection, Input, NodeEditor, Output, Socket } from 'rete';
import { Node } from 'rete/types';
import { Data, WorkerOutputs } from 'rete/types/core/data';
import PubSub from 'pubsub-js'

import { MagickComponent, MagickTask } from './magick-component';
import { MagickConsole } from './plugins/consolePlugin/MagickConsole';
import { Inspector } from './plugins/inspectorPlugin/Inspector';
import { ModuleManager } from './plugins/modulePlugin/module-manager';
import { Task, TaskOutputTypes } from './plugins/taskPlugin/task';
import { SocketNameType, SocketType } from './sockets';

export { MagickComponent } from './magick-component';
//@seang this was causing test enviroment issues to have it shared client/server
// export { MagickEditor } from './src/editor'
export type { InspectorData } from './plugins/inspectorPlugin/Inspector';

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
  embedding?: number[]
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

export type OnSubspellUpdated = (
  spellName: string,
  callback: (PubSubData) => void
) => void

export class MagickEditor extends NodeEditor<EventsTypes> {
  declare tasks: Task[]
  declare pubSub: PubSubContext
  declare magick: EditorContext
  declare tab: { type: string }
  declare abort: unknown
  declare loadGraph: (graph: Data, relaoding?: boolean) => Promise<void>
  declare moduleManager: ModuleManager
  declare runProcess: (callback?: () => void | undefined) => Promise<void>
  declare onSpellUpdated: (
    spellName: string,
    callback: any
  ) => OnSubspellUpdated
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
}) => Promise<Spell>

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
}: runSpellType<DataType>) => DataType

export type EngineContext = {
  env: Env
  runSpell: RunSpell
  completion?: (body: CompletionBody) => Promise<CompletionResponse>
  getSpell: GetSpell
  getCurrentSpell: () => Spell
  processCode?: ProcessCode
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
  node: MagickNode,
  callback: OnEditorCallback
) => () => void

export type PublishEditorEvent = (data: PubSubData) => void

export interface EditorContext extends EngineContext {
  sendToAvatar: (data: unknown) => void
  /**
   * @deprecated The method should not be used
   */
  onTrigger: (
    node: MagickNode | string,
    callback: (data: unknown) => void
  ) => () => void
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
  magick: EditorContext
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
  data: {
    outputs?: DataSocketType[]
    inputs?: DataSocketType[]
  }
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

export type ComponentData<T = TaskType> = Record<string, unknown> & {
  ignored?: { name: string }[]
  socketType?: SocketType
  taskType?: T
  icon?: string
}

export type InputComponentData = ComponentData<TaskType>
export type OutputComponentData = ComponentData<TaskType>

export type ModuleComponent = MagickComponent<unknown> & {
  run: (node: NodeData, data?: unknown) => Promise<void>
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

export type NodeData = {
  id: number
  socketKey?: string
  name?: string
  data: Record<string, unknown>
  [DataKey: string]: unknown
}

export type Module = { name: string; id: string; data: Data }

export type Spell = {
  name: string
  graph: Data
  createdAt?: string
  updatedAt?: string
  id: string
  hash?: string
  projectId: string
}

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

export type CompletionInspectorControls = {
  type: any
  dataKey: string
  name: string
  icon: string
  defaultValue: any
}

export type CompletionProvider = {
  type: CompletionType
  subtype: ImageCompletionSubtype | TextCompletionSubtype
  handler?: Function // server only
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
    module: any
    secrets: Record<string, string>
    projectId: string
    magick: EngineContext
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
  spell?: any
  nodeId?: number
}

export type RequestData = {
  spell: string
  projectId: string
  nodeId: number
}

export interface PubSubContext {
  publish: (event: string, data?: PubSubData) => boolean
  // eslint-disable-next-line @typescript-eslint/ban-types
  subscribe(event: string, func: PubSubJS.SubscriptionListener<PubSubData>): () => void;
  PubSub: typeof PubSub
  events: Record<string, any>
}