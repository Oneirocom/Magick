export interface Column {
  id:
    | 'action'
    | 'checkbox'
    | 'collapse'
    | 'provider'
    | 'type'
    | 'nodeId'
    | 'cost'
    | 'duration'
    | 'status'
    | 'statusCode'
    | 'model'
    | 'requestData'
    | 'responseData'
    | 'parameters'
    | 'spell'
  label: string
  minWidth?: number
  align?: 'right'
}

export const columns: Column[] = [
  { id: 'action', label: 'Actions', minWidth: 10 },
  { id: 'checkbox', label: '', minWidth: 10 },
  { id: 'collapse', label: '', minWidth: 10 },
  { id: 'provider', label: 'Provider', minWidth: 65 },
  { id: 'type', label: 'Type', minWidth: 65 },
  { id: 'nodeId', label: 'Node ID', minWidth: 65 },
  { id: 'cost', label: 'Cost', minWidth: 65 },
  { id: 'duration', label: 'Request Time', minWidth: 65 },
  { id: 'status', label: 'Status', minWidth: 65 },
  { id: 'statusCode', label: 'Code', minWidth: 65 },
  { id: 'model', label: 'Model', minWidth: 65 },
  { id: 'requestData', label: 'Request Data', minWidth: 65 },
  { id: 'responseData', label: 'Response Data', minWidth: 65 },
  { id: 'parameters', label: 'Parameters', minWidth: 65 },
  { id: 'spell', label: 'Spell', minWidth: 65 },
]

export interface DocumentData {
  row: any
  action: any
  provider: string
  type: string
  nodeId: string
  cost: string
  duration: string
  status: string
  statusCode: string
  model: string
  requestData: string
  responseData: string
  parameters: string
  spell: string
}
