// DOCUMENTED
import { calculateCompletionCost } from '../cost-calculator'
import { v4 } from 'uuid'
import { globalsManager } from '../globals'
import { RequestPayload } from '../types'

/**
 * Calculate and save request details in the module.
 *
 * @param projectId - The project identifier.
 * @param requestData - The request data object.
 * @param responseData - The response data object.
 * @param model - The model used for the request.
 * @param startTime - The starting timestamp of the request.
 * @param status - The request status.
 * @param statusCode - The status code of the response.
 * @param parameters - The request parameters.
 * @param provider - The provider used for the request.
 * @param type - The request type.
 * @param hidden - A boolean value indicating if the request is hidden or not.
 * @param processed - A boolean value indicating if the request has been processed or not.
 * @param totalTokens - The total number of tokens in the request.
 * @param spell - The spell object or string.
 * @param nodeId - The node identifier.
 * @returns A promise that resolves the saved request object.
 */
export function saveRequest({
  projectId,
  agentId,
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
  // Calculate the request cost based on total tokens and model.
  const cost =
    totalTokens !== undefined && totalTokens > 0
      ? calculateCompletionCost({
          totalTokens: totalTokens as number,
          model: model as any,
        })
      : 0

  // Calculate the request duration.
  const end = Date.now()
  const duration = end - startTime

  // Get Feathers app instance from globals manager.
  const app = globalsManager.get('feathers') as any

  // Save and create the request object in Feathers app.
  return app.service('request').create({
    id: v4(),
    projectId,
    agentId,
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
    // If spell is JSON, stringify it, otherwise keep the string value.
    spell: typeof spell === 'string' ? spell : JSON.stringify(spell),
    nodeId,
  })
}
