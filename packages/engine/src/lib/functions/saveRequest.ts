// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { calculateCompletionCost } from '@magickml/cost-calculator'
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
    model: model as any,
  })

  const end = Date.now()

  const duration = end - startTime

  const app = globalsManager.get('feathers') as any
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
    nodeId,
  })
}
