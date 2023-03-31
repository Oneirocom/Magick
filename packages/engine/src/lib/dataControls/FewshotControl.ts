import { DataControl } from '../plugins/inspectorPlugin'

export class FewshotControl extends DataControl {
  constructor({
    language = 'plaintext',
    icon = 'fewshot',
    dataKey = 'fewshot',
    name = 'fewshot',
    defaultValue = '',
  }) {
    const options = {
      dataKey,
      name,
      component: 'longText',
      icon,
      options: {
        editor: true,
        language: language,
        wordWrap: true
      },
      defaultValue
    }

    super(options)
  }

  onData() {
    return
  }
}
