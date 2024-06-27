console.log('HELLO WORLD')
import { CorePlugin } from '@magickml/core-plugin'
import { defineMagickPlugin } from '../../modules/agent-module/runtimes/utils/defineMagickPlugin'

// test
export default defineMagickPlugin({
  name: 'core',
  constructor: CorePlugin,
})
