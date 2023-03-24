import { NodeEditor } from 'rete'

import { MagickComponent } from '../../engine'
import { ComponentData, MagickNode } from '../../types'
import { Inspector } from './Inspector'
// export type RestProps = {}
export abstract class DataControl {
  inspector: Inspector | null = null
  editor: NodeEditor | null = null
  node: MagickNode | null = null
  component: MagickComponent<unknown> | null = null
  id: string | null = null
  dataKey: string
  name: string
  defaultValue: unknown
  componentData: ComponentData
  componentKey: string
  options: object
  icon: string
  write: boolean
  type: string
  placeholder: string
  data: ComponentData
  expanded?: boolean

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
    placeholder = ''
  }: {
    dataKey: string
    name: string
    component: string
    data?: ComponentData
    options?: Record<string, unknown>
    write?: boolean
    icon?: string
    defaultValue?: unknown
    type?: string
    placeholder?: string
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
    this.placeholder = placeholder
    this.data = data
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
      placeholder: this.placeholder
    }
  }

  onAdd() {
    return
  }

  onRemove() {
    return
  }

  onData?(...args: unknown[]): Promise<void> | void
}
