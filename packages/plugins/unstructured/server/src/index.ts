import { ServerPlugin } from '@magickml/core'
import { unstructured } from './services/unstructured/unstructured'

const UnstructuredPlugin = new ServerPlugin({
  name: 'UnstructuredPlugin',
  services: [unstructured],
})

export default UnstructuredPlugin
