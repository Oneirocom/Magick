export interface Column {
  id:
    | 'action'
    | 'collapse'
    | 'fileName'
    | 'id'
    | 'type'
    | 'content'
    | 'projectId'
    | 'date'
  label: string
  minWidth?: number
  align?: 'right'
}

export const columns: Column[] = [
  { id: 'action', label: 'Actions', minWidth: 10 },
  { id: 'collapse', label: '', minWidth: 10 },
  { id: 'fileName', label: 'File Name', minWidth: 65 },
  { id: 'content', label: 'Content (Preview)', minWidth: 65 },
  { id: 'type', label: 'Type', minWidth: 65 },
  { id: 'projectId', label: 'Project ID', minWidth: 65 },
  { id: 'date', label: 'Date', minWidth: 65 },
]

export interface DocumentData {
  row: any
  action: any
  fileName: any
  type: string
  content: string
  projectId: string
  date: string
}
