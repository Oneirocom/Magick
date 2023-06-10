import { ServerPlugin } from '@magickml/core'
import { qa } from './services/QA/qa'


const QAPlugin = new ServerPlugin({
  name: 'QAPLugin',
  services: [qa]
})

export default QAPlugin
