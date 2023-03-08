import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { pluginManager } from '@magickml/engine'

import './App.css'

import MainLayout from './components/MainLayout/MainLayout'
import MagickPageLayout from './components/MagickPageLayout/MagickPageLayout'

import HomeScreen from './screens/HomeScreen/HomeScreen'
import Magick from './screens/Magick/Magick'
import Contract from './screens/Contract/Contract'
import EventWindow from './workspaces/spells/windows/EventWindow'
import RequestWindow from './workspaces/spells/windows/RequestWindow'
import AgentManagerWindow from './workspaces/agents/AgentManagerWindow'
import SettingsWindow from './workspaces/settings/SettingsWindow'
import FineTuneManager from './screens/FineTuneManager/FineTuneManager'
import Completions from './screens/FineTuneManager/completions'
import NewFineTune from './screens/FineTuneManager/screens/NewFineTune'
import CompletionDetails from './screens/FineTuneManager/completions/CompletionDetails'

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'

const RenderComp = props => {
  return <props.element props={props} />
}

const singleUserMode = import.meta.env.VITE_APP_SINGLE_USER_MODE || true

const AppRoutes = () => (
  <>
    {pluginManager.getGroupedClientRoutes().map(pluginRouteGroup => {
      const ClientPageLayout = pluginRouteGroup.layout ?? MagickPageLayout
      return (
        <Route
          key={pluginRouteGroup.routes[0].path}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <ClientPageLayout />
            </Suspense>
          }
        >
          {pluginRouteGroup.routes.map(route => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={<RenderComp element={route.component} />}
              />
            )
          })}
        </Route>
      )
    })}

    <Route path="/events" element={<EventWindow />} />
    <Route path="/requests" element={<RequestWindow />} />
    <Route path="/agents" element={<AgentManagerWindow />} />
    {singleUserMode && <Route path="/settings" element={<SettingsWindow />} />}

    <Route element={<MagickPageLayout />}>
      <Route path="/home/*" element={<HomeScreen />} />
      <Route path="/" element={<Magick />} />
      <Route path="/magick/*" element={<Magick />} />
      <Route path="/magick/:URI" element={<Magick />} />
      <Route
        path="/contract/:chain/:address/:function"
        element={<Contract />}
      />
      <Route path="/fineTuneManager" element={<FineTuneManager />} />
      <Route path="/fineTuneManager/completions" element={<Completions />} />
      <Route path="/fineTuneManager/fine-tunes/new" element={<NewFineTune />} />
      <Route
        path="/fineTuneManager/fine-tune/:fineTuneId"
        element={<CompletionDetails />}
      />
    </Route>
  </>
)

const Routes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <AppRoutes />
    </Route>
  </Routes>
)

export default Routes