// DOCUMENTED
import { NodeEditor } from 'shared/rete'

import { MagickComponent } from '../../engine'
import { ComponentData, ControlData, MagickNode } from '../../types'
import { Inspector } from './Inspector'

// Add TSDoc comment to the class.
/**
 * A general class for the data controls.
 */
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
  options: Record<string, unknown>
  icon: string
  write: boolean
  type: string
  placeholder: string
  data: ComponentData
  expanded?: boolean
  tooltip?: string

  // Add TSDoc comment to the constructor.
  /**
   * Create a new instance of the DataControl class.
   * @param dataKey - The key for the data object
   * @param name - The name of the data control
   * @param component - The component name
   * @param data - The data object (optional)
   * @param options - The options object (optional)
   * @param write - The state of whether the control is writable or not (default: true)
   * @param icon - The icon of the data control (default: 'ankh')
   * @param defaultValue - The default value of the data control (optional)
   * @param type - The data type of the control value (default: 'string')
   * @param placeholder - The text to display when there's no text input (optional)
   */
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
    placeholder = '',
    tooltip = '',
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
    tooltip?: string
  }) {
    if (!dataKey) throw new Error('Data key is required')
    if (!name) throw new Error('Name is required')
    if (!component) throw new Error('Component name is required')

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
    this.tooltip = tooltip
  }

  // Add TSDoc comment to the method.
  /**
   * Serializer to easily extract the data control's information for publishing.
   */
  get control(): ControlData {
    return {
      dataKey: this.dataKey,
      name: this.name,
      component: this.componentKey,
      data: this.componentData,
      options: this.options,
      id: this.id,
      icon: this.icon,
      type: this.type,
      placeholder: this.placeholder,
      tooltip: this.tooltip,
    }
  }

  // Add TSDoc comment to the method.
  /**
   * Abstract method to execute when a control is added.
   */
  onAdd(): void | undefined {
    return
  }

  // Add TSDoc comment to the method.
  /**
   * Abstract method to execute when a control is removed.
   */
  onRemove(): void | undefined {
    return
  }

  // Add TSDoc comment to the (optional) method.
  /**
   * Abstract method to handle updating data (optional).
   * @param args - An array of unknown arguments
   */
  onData?(...args: unknown[]): Promise<void> | void
}
