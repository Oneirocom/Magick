export interface Column {
  id:
    | 'action'
    | 'name'
    | 'id'
    | 'tag'
    | 'content'
    | 'projectId'
    | 'date'
    | 'sourceUrl'
    | 'dataType'
    | 'createdAt'
  label: string
  minWidth?: number
  align?: 'right'
}

export const columns: Column[] = [
  { id: 'action', label: 'Actions', minWidth: 10 },
  { id: 'name', label: 'Name', minWidth: 65 },
  { id: 'sourceUrl', label: 'Source Url', minWidth: 65 },
  { id: 'tag', label: 'Type', minWidth: 65 },
  { id: 'dataType', label: 'Data Type', minWidth: 65 },
  { id: 'createdAt', label: 'Date', minWidth: 65 },
]

export interface KnowledgeData {
  row: any
  action: any
  name: string
  tag: string
  sourceUrl: string
  dataType: string
  date: string
}
