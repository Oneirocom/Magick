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
  error?: string | Error
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
