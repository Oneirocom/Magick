import {
NodeCategory,
SocketsList,
makeFlowNodeDefinition,
} from '@magickml/behave-graph'
import axios, { Method } from 'axios'

type RequestOptions = {
url: string
method: Method
headers?: Record<string, string>
params?: Record<string, string>
data?: Record<string, any>
timeout?: number
withCredentials?: boolean
auth?: {
username: string
password: string
}
responseType?: 'json' | 'text' | 'stream'
maxRedirects?: number
maxContentLength?: number
validateStatus?: (status: number) => boolean
}

export const requestNode = makeFlowNodeDefinition({
typeName: 'action/request',
category: NodeCategory.Action,
label: 'Request',
configuration: {
hiddenProperties: {
valueType: 'array',
defaultValue: ['hiddenProperties', 'socketInputs'],
},
socketInputs: {
valueType: 'array',
defaultValue: [],
},
},
in: configuration => {
const startSockets: SocketsList = [{ key: 'flow', valueType: 'flow' }]

    const socketArray = configuration?.socketInputs.length
      ? configuration.socketInputs
      : [
          { name: 'url', valueType: 'string' },
          { name: 'method', valueType: 'string' },
          { name: 'headers', valueType: 'object' },
          { name: 'params', valueType: 'object' },
          { name: 'data', valueType: 'object' },
          { name: 'timeout', valueType: 'number' },
          { name: 'withCredentials', valueType: 'boolean' },
          { name: 'auth', valueType: 'object' },
          { name: 'responseType', valueType: 'string' },
          { name: 'maxRedirects', valueType: 'number' },
          { name: 'maxContentLength', valueType: 'number' },
          { name: 'validateStatus', valueType: 'function' },
        ]

    const sockets: SocketsList =
      socketArray.map(socketInput => {
        return {
          key: socketInput.name,
          name: socketInput.name,
          valueType: socketInput.valueType,
        }
      }) || []

    return [...startSockets, ...sockets]

},
out: {
flow: 'flow',
response: 'object',
status: 'number',
headers: 'object',
data: 'object',
},
initialState: undefined,
triggered: async ({ commit, read, write, configuration }) => {
const options: RequestOptions = {
url: read('url') as string,
method: read('method') as Method,
headers: read('headers') as Record<string, string>,
params: read('params') as Record<string, string>,
data: read('data') as Record<string, any>,
timeout: read('timeout') as number,
withCredentials: read('withCredentials') as boolean,
auth: read('auth') as { username: string; password: string },
responseType: read('responseType') as 'json' | 'text' | 'stream',
maxRedirects: read('maxRedirects') as number,
maxContentLength: read('maxContentLength') as number,
validateStatus: read('validateStatus') as (status: number) => boolean,
}

    try {
      const response = await axios(options)
      write('response', response)
      write('status', response.status)
      write('headers', response.headers)
      write('data', response.data)
      commit('flow')
    } catch (error: any) {
      console.error('Request error:', error)
      throw error
    }

},
})
