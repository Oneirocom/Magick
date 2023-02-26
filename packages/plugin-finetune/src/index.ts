import Home from './screens/Home'

import { Plugin } from "@magickml/engine"

const FineTuneManager = new Plugin({
  name: 'FineTuneManagerPlugin',
  windowComponents: [{
    element: () => Home,
    path: '/fineTuneManager',
  }],
})

export default FineTuneManager;