import { DataControl } from '../plugins/inspectorPlugin'

export class CollectionControl extends DataControl {
  onUpdate: (newData: any) => void

  constructor(options: {
    name: string
    icon?: string
    write: boolean
    defaultValue?: string
    tooltip?: string
    initialValue?: { label: string; value: any } | null
    onUpdate?: (newData: {
      collection: { label: string; value: string }
    }) => void
  }) {
    const optionsWithDefaults = {
      dataKey: 'collection',
      name: options.name,
      component: 'collectionSelect',
      defaultValue: options.defaultValue || '',
      write: options.write,
      icon: options.icon || 'database',
      tooltip: options.tooltip || '',
      initialValue: options.initialValue || { label: 'All', value: 'all' },
    }
    super(optionsWithDefaults)
    this.onUpdate = options.onUpdate || (() => {})
  }
  updateData(newData: any) {
    console.log('updateData', newData)
    if (this.node) {
      this.node.data['collection'] = newData.collection.value.id
      this.onUpdate(newData)
    }
  }
}
