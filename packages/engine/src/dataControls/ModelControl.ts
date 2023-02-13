import { DataControl } from '../plugins/inspectorPlugin'

export class ModelControl extends DataControl {
  constructor({
    name,
    dataKey,
    defaultValue,
    icon = 'properties',
    write = true,
  }: {
    name: string
    dataKey: string
    defaultValue: string
    icon?: string
    write?: boolean
  }) {
    const options = {
      dataKey,
      name,
      component: 'modelSelect',
      write,
      icon,
      data: {
        defaultValue,
      },
    }

    super(options)
  }
}
