import { DataControl } from '../plugins/inspectorPlugin'

export class DropdownControl extends DataControl {
  constructor({
    name,
    dataKey,
    values,
    defaultValue,
    icon = 'properties',
    write = true,
  }: {
    name: string
    dataKey: string
    defaultValue: string
    values: string[]
    icon?: string
    write?: boolean
  }) {
    const options = {
      dataKey,
      name,
      component: 'dropdownSelect',
      write,
      icon,
      data: {
        defaultValue,
        values,
      },
    }

    super(options)
  }
}
