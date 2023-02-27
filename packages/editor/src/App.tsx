import * as React from 'react'
import './App.css'

import { useRoutes, RouteObject } from 'react-router-dom';
import { useRouter } from 'next/router'; 

import MagickPageLayout from './components/MagickPageLayout/MagickPageLayout'
import FineTuneManagerLayout from './screens/FineTuneManager/PageLayout'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import Magick from './screens/Magick/Magick'
import Contract from './screens/Contract/Contract'
import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'
import MainLayout from './components/MainLayout/MainLayout'
import EventWindow from './workspaces/spells/windows/EventWindow'
import AgentManagerWindow from './workspaces/agents/AgentManagerWindow'
import SettingsWindow from './workspaces/settings/SettingsWindow'
import FineTuneManager from './screens/FineTuneManager/FineTuneManager'
import Completions from './screens/FineTuneManager/completions'
import NewFineTune from './screens/FineTuneManager/screens/NewFineTune'
import CompletionDetails from './screens/FineTuneManager/completions/CompletionDetails'
import RequestWindow from './workspaces/spells/windows/RequestWindow'

const singleUserMode = import.meta.env.VITE_APP_SINGLE_USER_MODE || true;

const fineTuneRoutes: RouteObject[] = [
  {
    path: '/fineTuneManager',
    element: <FineTuneManager />,
    children: [
      { path: '/completions', element: <Completions /> },
      { path: '/fine-tunes/new', element: <NewFineTune /> },
      { path: '/fine-tune/:fineTuneId', element: <CompletionDetails /> },
    ],
  },
];

const magickRoutes: RouteObject[] = [
  { path: '/home/*', element: <HomeScreen /> },
  { path: '/', element: <Magick /> },
  { path: '/magick/*', element: <Magick /> },
  { path: '/magick/:spellName', element: <Magick /> },
  { path: '/contract/:chain/:address/:function', element: <Contract /> },
  { path: '/*', element: <Magick /> },
];

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/events', element: <EventWindow /> },
      { path: '/requests', element: <RequestWindow /> },
      { path: '/agents', element: <AgentManagerWindow /> },
      ...(singleUserMode ? [{ path: '/settings', element: <SettingsWindow /> }] : []),
      { path: '/fineTuneManager', children: fineTuneRoutes },
      { path: '/', children: magickRoutes },
    ],
  },
];

function App() {
  const routerType = typeof useRouter === 'function' ? 'next' : 'react-router-dom';
  const routing = useRoutes(routes);

  return (
    <>
      {routerType === 'next' && <Head>...</Head>}
      {routing}
    </>
  );
}

export default App;
