export interface Column {
  id: 'action' | 'collapse' | 'id' | 'type' | 'content' | 'intent' | 'date'
  label: string
  minWidth?: number
  align?: 'right'
}

export const columns: Column[] = [
  { id: 'action', label: 'Actions', minWidth: 10 },
  { id: 'collapse', label: '', minWidth: 10 },
  { id: 'content', label: 'Content', minWidth: 65 },
  { id: 'intent', label: 'Intent', minWidth: 65 },
  { id: 'type', label: 'Type', minWidth: 65 },
  { id: 'date', label: 'Date', minWidth: 65 },
]

export interface IntentData {
  row: any
  action: any
  type: string
  content: string
  intent: string
  date: string
}
