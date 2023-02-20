import { globalsManager } from '../globals'

type RequestPayload = {
  projectId: string
  requestData: string
  responseData?: string
  model?: string
  duration?: number
  status?: string
  statusCode?: number
  error?: string
  parameters?: string
  provider?: string
  type?: string
  hidden?: boolean
  processed?: boolean
  cost: number
}

export function saveRequest({
  projectId,
  requestData,
  responseData,
  model,
  duration,
  status,
  statusCode,
  error,
  parameters,
  provider,
  type,
  hidden,
  processed,
  cost,
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
    error,
    provider,
    type,
    hidden,
    processed,
    cost,
  })
}
