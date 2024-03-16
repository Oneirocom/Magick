import { makeFlowNodeDefinition, NodeCategory } from '@magickml/behave-graph'

export const FetchNode = makeFlowNodeDefinition({
  typeName: 'actions/http/fetch',
  category: NodeCategory.Action,
  label: 'Fetch',
  in: {
    url: 'string',
    method: {
      valueType: 'string',
      choices: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
    headers: {
      valueType: 'object',
      optional: true,
    },
    body: {
      valueType: 'object',
      optional: true,
    },
    authToken: {
      valueType: 'string',
      optional: true,
    },
    authTokenHeader: {
      valueType: 'string',
      optional: true,
      default: 'Authorization',
    },
    flow: 'flow',
  },
  out: {
    response: 'object',
    flow: 'flow',
  },
  initialState: undefined,
  triggered: async ({ commit, read }) => {
    const url = read('url') as string
    const method = read('method') as string
    const headers = (read('headers') || {}) as Record<string, string>
    const body = read('body') || {}
    const authToken = read('authToken')
    const authTokenHeader = read('authTokenHeader') as string

    // Add the auth token header if provided or retrieved from secrets
    if (authToken) {
      headers[authTokenHeader] = `Bearer ${authToken}`
    }
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const responseData = await response.json()
    commit('response', responseData)
    commit('flow')
  },
})
