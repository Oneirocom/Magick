// DOCUMENTED
/**
 * An extension of DataControl class that manages spell data.
 * @extends DataControl
 */
import { DataControl } from '../plugins/inspectorPlugin'

export class SpellControl extends DataControl {
  /**
   * Creates a new instance of SpellControl.
   * @param {Object} options - Options for SpellControl.
   * @param {string} options.name - The name of the spell control.
   * @param {string} [options.icon=sieve] - The icon for the spell control.
   * @param {boolean} options.write - If the SpellControl should have write permissions.
   * @param {string} [options.defaultValue=''] - The default value of the SpellControl.
   */
  constructor(options: {
    name: string
    icon?: string
    write: boolean
    defaultValue?: string
    tooltip?: string
  }) {
    const optionsWithDefaults = {
      dataKey: 'spell',
      name: options.name,
      component: 'spellSelect',
      defaultValue: options.defaultValue || '',
      write: options.write,
      icon: options.icon || 'sieve',
      tooltip: options.tooltip || '',
    }
    super(optionsWithDefaults)
  }
}
