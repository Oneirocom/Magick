import { DataControl } from '../plugins/inspectorPlugin'
export class WysiwygControl extends DataControl {
  constructor({ dataKey, name, icon = 'feathers' }) {
    const options = {
      dataKey: dataKey,
      name: name,
      component: 'wysiwyg',
      icon,
      options: {
        editor: true,
        language: 'test',
      },
    }

    super(options)
  }

  onData() {
    return
  }
}
