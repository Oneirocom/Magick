console.log('HELLO WORLD')
import { CorePlugin } from 'plugin/core'
import { defineMagickPlugin } from '../../modules/agent-module/runtimes/utils/defineMagickPlugin'

// test
export default defineMagickPlugin({
  name: 'core',
  constructor: CorePlugin,
})
