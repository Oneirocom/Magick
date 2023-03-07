import { v4 } from 'uuid'
import { globalsManager } from '../globals'

type RequestPayload = {
  projectId: string
  requestData: string
  responseData?: string
  model?: string
  duration?: number
  status?: string
  statusCode?: number
  parameters?: string
  provider?: string
  type?: string
  hidden?: boolean
  processed?: boolean
  cost?: number
  spell?: any
  nodeId?: number
}

export type RequestData = {
  spell: string
  projectId: string
  nodeId: number
}

export function saveRequest({
  projectId,
  requestData,
  responseData,
  model,
  duration,
  status,
  statusCode,
  parameters,
  provider,
  type,
  hidden,
  processed,
  cost,
  spell,
  nodeId,
}: RequestPayload) {
  console.log('saveRequest', projectId)
  const app = globalsManager.get('feathers')
  return app.service('request').create({
    id: v4(),
    projectId,
    requestData,
    responseData,
    model,
    statusCode,
    parameters,
    duration,
    status,
    provider,
    type,
    hidden,
    processed,
    cost,
    // if spell is json, stringify it
    spell: typeof spell === 'string' ? spell : JSON.stringify(spell),
    nodeId
  })
}
