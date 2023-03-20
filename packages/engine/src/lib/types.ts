import { Connection, Input, NodeEditor, Output } from 'rete'
import { Node } from 'rete/types'
import {
  Data, InputData, InputsData, NodeData, OutputData, OutputsData, WorkerOutputs
} from 'rete/types/core/data'

import { MagickComponent, MagickTask } from './magick-component'
import { MagickConsole } from './plugins/consolePlugin/MagickConsole'
import { Inspector } from './plugins/inspectorPlugin/Inspector'
import { ModuleManager } from './plugins/modulePlugin/module-manager'
import { Task, TaskOutputTypes } from './plugins/taskPlugin/task'
import { SocketNameType, SocketType } from './sockets'

import PubSub from 'pubsub-js'

export { MagickComponent } from './magick-component'
//@seang this was causing test enviroment issues to have it shared client/server
// export { MagickEditor } from './src/editor'
export type { InspectorData } from './plugins/inspectorPlugin/Inspector'

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

export type OnSubspellUpdated = (spell: Spell) => void

export class MagickEditor extends NodeEditor<EventsTypes> {
  declare tasks: Task[]
  declare pubSub: PubSubContext
  declare magick: EditorContext
  declare tab: { type: string }
  declare abort: unknown
  declare loadGraph: (graph: Data, relaoding?: boolean) => Promise<void>
  declare moduleManager: ModuleManager
  declare runProcess: (callback?: () => void | undefined) => Promise<void>
  declare onSpellUpdated: (spellName: string, callback: (spell: Spell) => void) => () => void
  declare refreshEventTable: () => void
}

export type Env = {
  API_ROOT_URL: string
}

export type UnknownData = Record<string, unknown>
export type UnknownSpellData = UnknownData

export type runSpellType<DataType=UnknownSpellData> = {
  inputs: MagickSpellInput
  spellName: string
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

export type RunSpell<DataType=Record<string, unknown>> = ({
  inputs,
  spellName,
  projectId,
  secrets,
  publicVariables
}: runSpellType<DataType>) => Promise<DataType>

export type EngineContext<DataType=Record<string, unknown>> = {
  env: Env
  runSpell: RunSpell<DataType>
  completion?: (body: CompletionBody) => Promise<CompletionResponse>
  getSpell: GetSpell
  getCurrentSpell: () => Spell
  processCode?: ProcessCode
}

export type PubSubEvents = {
  ADD_SUBSPELL: string
  UPDATE_SUBSPELL: string
  DELETE_SUBSPELL: string
  OPEN_TAB: string
  $SUBSPELL_UPDATED: (spellName: string) => string
  $TRIGGER: (tabId: string, nodeId?: string) => string
  $PLAYTEST_INPUT: (tabId: string) => string
  $PLAYTEST_PRINT: (tabId: string) => string
  $DEBUG_PRINT: (tabId: string) => string
  $DEBUG_INPUT: (tabId: string) => string
  $INSPECTOR_SET: (tabId: string) => string
  $TEXT_EDITOR_SET: (tabId: string) => string
  $TEXT_EDITOR_CLEAR: (tabId: string) => string
  $CLOSE_EDITOR: (tabId: string) => string
  $NODE_SET: (tabId: string, nodeId: string) => string
  $SAVE_SPELL: (tabId: string) => string
  $SAVE_SPELL_DIFF: (tabId: string) => string
  $CREATE_MESSAGE_REACTION_EDITOR: (tabId: string) => string
  $CREATE_PLAYTEST: (tabId: string) => string
  $CREATE_INSPECTOR: (tabId: string) => string
  $CREATE_TEXT_EDITOR: (tabId: string) => string
  $CREATE_AVATAR_WINDOW: (tabId: string) => string
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
  $SEND_TO_AVATAR: (tabId: string) => string
}

export interface PubSubContext {
  publish: (event: string, data?: PubSubData) => boolean
  // eslint-disable-next-line @typescript-eslint/ban-types
  subscribe(event: string, func: PubSubJS.SubscriptionListener<PubSubData>): () => void;
  PubSub: typeof PubSub
  events: PubSubEvents
}

export type PubSubData = Record<string, unknown> | string | unknown[]
export type PubSubCallback = (event: string, data: PubSubData) => void

export type OnInspectorCallback = (data: Record<string, unknown>) => void
export type OnInspector = (node: MagickNode, callback: OnInspectorCallback) => () => void
export type OnEditorCallback = (data: PubSubData) => void
export type OnEditor = (callback: OnEditorCallback) => () => void
export type OnDebug = (node: MagickNode, callback: OnEditorCallback) => () => void

export type PublishEditorEvent = (data: PubSubData) => void

export interface EditorContext extends EngineContext {
  sendToAvatar: (data: unknown) => void
  /**
  * @deprecated The method should not be used
  */
  onTrigger: (node: MagickNode | string, callback: (data: unknown) => void) => () => void
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

export type MagicNodeInput = Input & { socketType: DataSocketType; }
export type MagicNodeOutput = Output & { taskType?: TaskType; socketType: DataSocketType; }

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

export type OpenAIResultChoice = {
  text: string
  index: number
  logprobs: number[]
  // TODO: Didn't find any docummantation or usage of this field
  top_logprobs: unknown[]
  text_offset: number[]
}

export type OpenAIResponse = {
  id: string
  object: string
  created: number
  model: string
  choices: OpenAIResultChoice[]
  finish_reason: string
}

export type Subspell = { name: string; id: string; data: GraphData }

export type GraphData = Data

export type IgnoredList = {
  name: string
}[] | string[]

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
  isInput?: boolean; 
  useDefault?: boolean; 
  defaultValue?: string
  element?: number
  [DataKey: string]: unknown
}

export type WorkerData = NodeData & {
  // outputs: DataSocketOutput
  // inputs: DataSocketInput
  spell?: string
  data?: MagickNodeData
  [key: string]: unknown;
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

export function AsInputsAndOutputsData(data: DataSocketType[]): InputsData & OutputsData {
  return data as unknown as InputsData & OutputsData
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

export type MessagingRequest = unknown
