import { ParamsDictionary, Query } from 'express-serve-static-core'
import { Request } from 'express'
/* eslint-disable camelcase */
import { Component, Connection, Input, Output, NodeEditor } from 'rete'
import { Node } from 'rete/types'
//@seang todo: convert inspector plugin fully to typescript
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import {
  Data,
  NodeData as ReteNodeData,
  WorkerInputs,
  WorkerOutputs,
} from 'rete/types/core/data'

import { MagickConsole } from './src/plugins/debuggerPlugin/MagickConsole'
import { Inspector } from './src/plugins/inspectorPlugin/Inspector'
import { ModuleManager } from './src/plugins/modulePlugin/module-manager'
import { Task, TaskOutputTypes } from './src/plugins/taskPlugin/task'
import { SocketNameType, SocketType } from './src/sockets'
import { PubSubContext, MagickTask } from './src/magick-component'
import { spells } from '@prisma/client'

export { MagickComponent } from './src/magick-component'
//@seang this was causing test enviroment issues to have it shared client/server
// export { MagickEditor } from './src/editor'

export type { InspectorData } from './src/plugins/inspectorPlugin/Inspector'

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

export type CreateEventArgs = {
  type: string
  agent: string
  speaker: string
  sender: string
  text: string
  client: string
  channel: string
}

export type GetEventArgs = {
  type: string
  agent: string
  speaker: string
  client: string
  channel: string
  maxCount: number
  max_time_diff: number
}

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

export class MagickEditor extends NodeEditor<EventsTypes> {
  declare tasks: Task[]
  declare pubSub: PubSubContext
  declare magick: EditorContext
  declare tab: { type: string }
  declare abort: unknown
  declare loadGraph: (graph: Data, relaoding?: boolean) => Promise<void>
  declare moduleManager: ModuleManager
  declare runProcess: (callback?: Function | undefined) => Promise<void>
  declare onSpellUpdated: (spellId: string, callback: Function) => Function
  declare refreshEventTable: () => void
}

export type EngineContext = {
  getCurrentGameState: () => Record<string, unknown>
  setCurrentGameState: (state: Record<string, unknown>) => void
  updateCurrentGameState: (update: Record<string, unknown>) => void
  runSpell: (
    flattenedInputs: Record<string, any>,
    spellId: string,
    state: Record<string, any>
  ) => Record<string, any>
  completion: (body: CompletionBody) => Promise<CompletionResponse>
  getSpell: (spellId: string) => Promise<spells | Spell>
  processCode: (
    code: unknown,
    inputs: MagickWorkerInputs,
    data: Record<string, any>,
    state: Record<string, any>,
    language?: string | null
  ) => any | void
  queryGoogle: (query: string) => Promise<string>
  getEvent: (
    args: GetEventArgs
  ) => Promise<string | string[] | null | Record<string, any>>
  storeEvent: (args: CreateEventArgs) => Promise<any>
  getWikipediaSummary: (keyword: string) => Promise<Record<string, any> | null>
}

export type EventPayload = Record<string, any>

export interface EditorContext extends EngineContext {
  sendToAvatar: (data: any) => void
  onTrigger: (node: MagickNode | string, callback: Function) => Function
  sendToPlaytest: (data: string) => void
  sendToInspector: (data: EventPayload) => void
  sendToDebug: (data: EventPayload) => void
  onInspector: (node: MagickNode, callback: Function) => Function
  onPlaytest: (callback: Function) => Function
  onDebug: (node: NodeData, callback: Function) => Function
  clearTextEditor: () => void
  getCurrentGameState: () => Record<string, unknown>
  updateCurrentGameState: (update: EventPayload) => void
  refreshEventTable: () => void
  processCode: (
    code: unknown,
    inputs: MagickWorkerInputs,
    data: Record<string, any>,
    state: Record<string, any>
  ) => any | void
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

export interface Spell {
  id?: string
  user?: Record<string, unknown> | string | null | undefined
  name: string
  graph: GraphData
  // Spells: Module[]
  gameState?: Record<string, unknown>
  createdAt?: number
  updatedAt?: number
}

export type Agent = {
  output: string
  speaker: string
  agent: string
  client: string
  channel: string
  channelId: string
  entity: number
  roomInfo?: {
    user: string
    inConversation: boolean
    isBot: boolean
    info3d: string
  }[]
  eth_private_key: string
  eth_public_address: string
  channelType: string
}

export interface IRunContextEditor extends NodeEditor {
  magick: EditorContext
  abort: Function
}

export type DataSocketType = {
  name: SocketNameType
  taskType: 'output' | 'option'
  socketKey: string
  connectionType: 'input' | 'output'
  socketType: SocketType
  useSocketName: boolean
}

export type MagickNode = Node & {
  inspector: Inspector
  display: (content: string) => void
  outputs: { name: string; [key: string]: unknown }[]
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
  createdAt: number
  updatedAt: number
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

export type ModuleComponent = Component & {
  run: Function
  nodeTaskMap: Map<string, any>
}

export type NodeConnections = {
  node: number
  input?: string
  output?: string
  data: Record<string, unknown>
}

export type NodeOutputs = {
  output?: {
    connections: NodeConnections[]
  }
  trigger?: {
    connections: NodeConnections[]
  }
  action?: {
    connections: NodeConnections[]
  }
}

export type GraphData = Data

export type NodeData = ReteNodeData & {
  fewshot?: string
  display: Function
  error?: boolean
  console: MagickConsole
}

// export type Node = {
//   id: number,
//   data: NodeData,
//   name: string,
//   inputs: NodeOutputs,
//   outputs?: NodeOutputs,
//   position: number[]
// }

// export type Spell = {
//   id: string
//   nodes: Record<number, Node>
// }

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

export type WorkerReturn =
  | Node
  | MagickWorkerOutputs
  | void
  | Promise<void>
  | Promise<{ actionType: string }>
  | Promise<{ difficulty?: string; category?: string }>
  | Promise<{ [output: string]: string } | null>
  | Promise<never[] | { entities: { name: string; type: string }[] }>
  | Promise<{ element: unknown } | undefined>
  | Promise<
      | { result: { error: unknown; [key: string]: unknown } }
      | { result?: undefined }
    >
  | Promise<{ text: unknown }>
  | Promise<{ boolean: boolean }>
  | Promise<null | undefined>
  | WorkerOutputs[]
  | { trigger: boolean }
export type MagickWorker = (
  node: MagickNode,
  inputs: WorkerInputs,
  outputs: WorkerOutputs,
  ...args: unknown[]
) => WorkerReturn

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

export type MessagingRequest = Request<
  ParamsDictionary,
  any,
  MessagingWebhookBody,
  Query
>
