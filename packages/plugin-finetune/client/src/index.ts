// GENERATED 
/**
 * This module contains a React component called FineTuneManager that wraps several screens for fine-tuning pre-trained models.
 * 
 * @module FineTuneManager
 */

import * as React from 'react';
import Home from './screens/Home';
import Completions from './completions/CompletionList';
import NewFineTune from './screens/NewFineTune';
import CompletionDetails from './completions/CompletionDetails';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { ClientPlugin } from '@magickml/engine';

/**
 * A plugin for managing fine-tuning of pre-trained models. It contains routes and drawer items for various screens.
 */
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
    },
    {
      path: '/fineTuneManager/completions',
      component: Completions,
    },
    {
      path: '/fineTuneManager/fine-tunes/new',
      component: NewFineTune,
    },
    {
      path: '/fineTuneManager/fine-tune/:fineTuneId',
      component: CompletionDetails,
    },
  ],
});

export * from './types/openai';

export default FineTuneManager;