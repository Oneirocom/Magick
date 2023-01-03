import { Node, NodeEditor } from 'rete'

import { ThothComponent } from '../../thoth-component'
import { Inspector } from './Inspector'
export type RestProps = {}
export abstract class DataControl {
  inspector: Inspector | null = null
  editor: NodeEditor | null = null
  node: Node | null = null
  component: ThothComponent<unknown> | null = null
  id: string | null = null
  dataKey: string
  key: string
  name: string
  defaultValue: unknown
  componentData: object
  componentKey: string
  options: object
  icon: string
  write: boolean
  data: Record<string, unknown>
  type: string

  constructor({
    dataKey,
    name,
    component,
    data = {},
    options = {},
    write = true,
    icon = 'ankh',
    defaultValue = null,
    type = 'string',
  }: {
    dataKey: string
    name: string
    component: string
    data?: Record<string, unknown>
    options?: Record<string, unknown>
    write?: boolean
    icon?: string
    defaultValue?: unknown
    type?: string
  }) {
    if (!dataKey) throw new Error(`Data key is required`)
    if (!name) throw new Error(`Name is required`)
    if (!component) throw new Error(`Component name is required`)

    this.dataKey = dataKey
    this.name = name
    this.componentData = data
    this.componentKey = component
    this.options = options
    this.icon = icon
    this.write = write
    this.defaultValue = defaultValue
    this.type = type
  }

  //Serializer to easily extract the data controls information for publishing
  get control() {
    return {
      dataKey: this.dataKey,
      name: this.name,
      component: this.componentKey,
      data: this.componentData,
      options: this.options,
      id: this.id,
      icon: this.icon,
      type: this.type,
    }
  }

  onAdd() {
    return
  }

  onData?: (...args: any[]) => Promise<void> | void
}
