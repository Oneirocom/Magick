import * as React from 'react'

import Home from './screens/Home'
import Completions from './completions/CompletionList'
import NewFineTune from './screens/NewFineTune'
import CompletionDetails from './completions/CompletionDetails'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import { ClientPlugin } from '@magickml/engine'

export * from './types/openai'

const FineTuneManager = new ClientPlugin({
  name: 'FineTuneManagerPlugin',
  drawerItems: [
    {
      path: '/fineTuneManager',
      icon: AutoStoriesIcon,
      text: 'Fine Tuning',
    },
  ],
  clientPageLayout: React.lazy(() => import('./PageLayout')),
  clientRoutes: [
    {
      path: '/fineTuneManager',
      component: Home,
      plugin: 'fineTuneManager',
    },
    {
      path: '/fineTuneManager/completions',
      component: Completions,
      plugin: 'fineTuneManager/completions',
    },
    {
      path: '/fineTuneManager/fine-tunes/new',
      component: NewFineTune,
      plugin: 'fineTuneManager/fine-tunes/new',
    },
    {
      path: '/fineTuneManager/fine-tune/:fineTuneId',
      component: CompletionDetails,
      plugin: 'fineTuneManager/fine-tune/:fineTuneId',
    },
  ],
})

export default FineTuneManager
