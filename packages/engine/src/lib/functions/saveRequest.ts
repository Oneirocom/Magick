import { calculateCompletionCost, ChatModel, TextModel } from '@magickml/cost-calculator'
import { v4 } from 'uuid'
import { globalsManager } from '../globals'
import { RequestPayload } from '../types'

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
    model: model as TextModel | ChatModel,
  })

  const end = Date.now()

  const duration = end - startTime

  const app = globalsManager.get('feathers') as { service: any }
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
