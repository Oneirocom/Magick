import { Connection, Input, NodeEditor, Output } from 'rete'
import { Node } from 'rete/types'
import {
  Data, WorkerOutputs
} from 'rete/types/core/data'

import { MagickComponent, MagickTask, PubSubContext } from './magick-component'
import { MagickConsole } from './plugins/consolePlugin/MagickConsole'
import { Inspector } from './plugins/inspectorPlugin/Inspector'
import { ModuleManager } from './plugins/modulePlugin/module-manager'
import { Task, TaskOutputTypes } from './plugins/taskPlugin/task'
import { SocketNameType, SocketType } from './sockets'

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
  entities?: any[]
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
  stop: any
  apiKey?: string
}

export type CompletionResponse = {
  success: any
  choice: any
}

export type OnSubspellUpdated = (spellName: string, callback: (PubSubData)=>void) => void

export class MagickEditor extends NodeEditor<EventsTypes> {
  declare tasks: Task[]
  declare pubSub: PubSubContext
  declare magick: EditorContext
  declare tab: { type: string }
  declare abort: unknown
  declare loadGraph: (graph: Data, relaoding?: boolean) => Promise<void>
  declare moduleManager: ModuleManager
  declare runProcess: (callback?: () => void | undefined) => Promise<void>
  declare onSpellUpdated: (spellName: string, callback: PubSubCallback) => OnSubspellUpdated
  declare refreshEventTable: () => void
}

export type Env = {
  API_ROOT_URL: string
}

type runSpellType = {
  inputs: Record<string, any>
  spellName: string
  projectId: string
  secrets: Record<string, any>
  publicVariables: Record<string, any>
}

export type EngineContext = {
  env: Env
  runSpell: ({
    inputs,
    spellName,
    projectId,
    secrets,
    publicVariables
  }: runSpellType) => Record<string, any>
  completion?: (body: CompletionBody) => Promise<CompletionResponse>
  getSpell: ({
    spellName,
    projectId,
  }: {
    spellName: string
    projectId: string
  }) => Promise<any | Spell>
  getCurrentSpell: () => Spell
  processCode?: (
    code: unknown,
    inputs: MagickWorkerInputs,
    data: Record<string, any>,
    language?: string
  ) => any | void
}

export type EventPayload = Record<string, any>
export type PubSubData = Record<string, any> | string | any[]
export type PubSubCallback = (event: string, data: PubSubData) => void

export type OnInspectorCallback = (data: PubSubData) => void
export type OnInspector = (node: MagickNode, callback: OnInspectorCallback) => ()=>void
export interface EditorContext extends EngineContext {
  sendToAvatar: (data: any) => void
  /**
  * @deprecated The method should not be used
  */
  onTrigger: (node: MagickNode | string, callback: (data: unknown) => void) => ()=>void
  sendToPlaytest: (data: string) => void
  sendToInspector: (data: EventPayload) => void
  sendToDebug: (data: EventPayload) => void
  onInspector: (node: MagickNode, callback: OnInspectorCallback) => ()=>void
  onPlaytest: (callback: PubSubCallback) => ()=>void
  onDebug: (node: NodeData, callback: PubSubCallback) => ()=>void
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
  abort: Function
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
  data: {
    outputs?: DataSocketType[]
    inputs?: DataSocketType[]
  }
  category?: string
  displayName?: string
  info: string
  subscription: Function
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
  top_logprobs: any[]
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

export type ComponentData<T = TaskType> = Record<string, unknown> & {
  ignored?: { name: string }[]
  socketType?: SocketType
  taskType?: T
  icon?: string
}

export type InputComponentData = ComponentData<TaskType>
export type OutputComponentData = ComponentData<TaskType>

export type ModuleComponent = MagickComponent<unknown> & {
  run: Function
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
  socketKey?: string
  name?: string
  [DataKey: string]: any
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

export type ModuleWorkerOutput = WorkerOutputs & {
  [key: string]: any
}

export type MagickWorkerInput = string | unknown | MagickReteInput
export type MagickWorkerInputs = { [key: string]: MagickWorkerInput[] }
export type MagickWorkerOutputs = WorkerOutputs & {
  [key: string]: TaskOutput
}

// Type definitions for PubSubJS 1.8.0
// Project: https://github.com/mroderick/PubSubJS
// Definitions by: Boris Yankov <https://github.com/borisyankov>
//                 Matthias Lindinger <https://github.com/morpheus-87>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export interface PubSubBase
  extends CountSubscriptions,
  ClearAllSubscriptions,
  GetSubscriptions,
  Publish,
  Subscribe,
  Unsubscribe {
  name: string
}

interface CountSubscriptions {
  countSubscriptions(token: any): number
}

interface ClearAllSubscriptions {
  clearAllSubscriptions(token?: any): void
}

interface GetSubscriptions {
  getSubscriptions(token: any): any[]
}

interface Publish {
  publish(message: string | symbol, data?: any): boolean

  publishSync(message: string | symbol, data?: any): boolean
}

interface Subscribe {
  subscribe(message: string | symbol, func: Function): string

  subscribeOnce(message: string | symbol, func: Function): any
}

interface Unsubscribe {
  unsubscribe(tokenOrFunction: any): any
}

// Go-inspired function return
export type GoFn = [
  boolean, // Ok
  string | null, // Message
  any // body
]

// Elixir-inspired function return
export type ExFn = [true, any] | [false, string]

export type SearchSchema = {
  title: string
  description: string
}

export type ClassifierSchema = {
  type: string
  examples: string[] | string
}

type MessagingWebhookBody = {
  MessageSid: string
  Body: string
  From: string
  To: string
}

export type MessagingRequest = any
