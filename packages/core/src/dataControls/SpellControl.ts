import { DataControl } from '../plugins/inspectorPlugin'

export class SpellControl extends DataControl {
  constructor({
    name,
    icon = 'sieve',
    write = false,
    defaultValue = '',
  }: {
    name: string
    icon?: string
    write: boolean
    defaultValue?: string
  }) {
    const options = {
      dataKey: 'spell',
      name: name,
      component: 'spellSelect',
      defaultValue,
      write,
      icon,
    }

    super(options)
  }
}
