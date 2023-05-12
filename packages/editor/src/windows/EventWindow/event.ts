export interface Column {
  id:
    | 'action'
    | 'client'
    | 'sender'
    | 'content'
    | 'type'
    | 'channel'
    | 'observer'
    | 'date'
  label: string
  minWidth?: number
  align?: 'right'
}

export const columns: Column[] = [
  { id: 'action', label: 'Actions', minWidth: 10 },
  { id: 'client', label: 'Client', minWidth: 65 },
  { id: 'sender', label: 'Sender', minWidth: 65 },
  { id: 'content', label: 'Content', minWidth: 65 },
  { id: 'type', label: 'Type', minWidth: 65 },
  { id: 'channel', label: 'Channel', minWidth: 65 },
  { id: 'observer', label: 'Observer', minWidth: 65 },
  { id: 'date', label: 'Date', minWidth: 65 },
]

export interface EventData {
  row: any
  action: any
  client: string
  sender: string
  content: string
  type: string
  channel: string
  observer: string
  date: string
}
