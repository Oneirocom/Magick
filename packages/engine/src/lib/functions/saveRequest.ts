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
  estimatedCost?: number
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
  estimatedCost,
}: RequestPayload) {
  const app = globalsManager.get('feathers')
  return app.service('request').create({
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
    estimatedCost,
  })
}
