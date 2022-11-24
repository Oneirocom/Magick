export type AddClient = {
  client: string
  name: string
  type: string
  defaultValue: string | boolean
}

export type EditClient = {
  name: string
  defaultValue: string
  id: string
}

export type ClientFilterOptions = {
  per_page: number | string
  page: number | string
  search?: string
  field?: string
  id?: string
}

export type AddConfiguration = {
  key: string
  value: string
}

export type EditConfiguration = {
  key: string
  value: string
  id: string
}

export type ConfigurationFilterOptions = {
  per_page: number | string
  page: number | string
  search?: string
  field?: string
  id?: string
}

export type FullTableSize = {
  value: string
  label: string
}

export type TableSize = {
  value: string
  label: string
}

export type AddScope = {
  tables: string
  fullTableSize?: FullTableSize | string
  tableSize?: TableSize | string
  recordCount?: string | number
}

export type EditScope = {
  id: number
  tables: string
  fullTableSize?: FullTableSize
  tableSize?: TableSize
  recordCount?: string
  isDeleted?: Boolean
}

export type ScopeFilterOptions = {
  per_page: number | string
  page: number | string
  search?: string
  field?: string
  id?: string
}

export enum AddScopeOptional {
  FULLTABLESIZE = 'fullTableSize',
  TABLESIZE = 'tableSize',
  RECORDCOUNT = 'recordCount',
}
