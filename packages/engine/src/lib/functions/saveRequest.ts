import { calculateCompletionCost } from '@magickml/cost-calculator'
import { v4 } from 'uuid'
import { globalsManager } from '../globals'
<<<<<<< HEAD
import { RequestPayload } from '../types'
=======

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
  spell?: string
  nodeId?: number
}

export type RequestData = {
  spell: string
  projectId: string
  nodeId: number
}
>>>>>>> pizzooid/typings

export function saveRequest({
  projectId,
  requestData,
  responseData,
  model,
  startTime,
  status,
  statusCode,
  parameters,
  provider,
  type,
  hidden,
  processed,
  totalTokens,
  spell,
  nodeId,
}: RequestPayload) {
  const cost = calculateCompletionCost({
    totalTokens,
    model,
  })

  const end = Date.now()

  const duration = end - startTime

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
