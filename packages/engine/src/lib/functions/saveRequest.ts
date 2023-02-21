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
}: RequestPayload) {
  console.log('saveRequest', projectId, requestData, responseData, model, duration, status, statusCode, parameters, provider, type, hidden, processed, cost)
  const app = globalsManager.get('feathers')
  console.log(app.service('request'))
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
  })
}
