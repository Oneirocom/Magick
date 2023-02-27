import React from 'react'

import './App.css'

import { Routes, Route } from 'react-router-dom'
import MagickPageLayout from './components/MagickPageLayout/MagickPageLayout'

import HomeScreen from './screens/HomeScreen/HomeScreen'
import Magick from './screens/Magick/Magick'
import Contract from './screens/Contract/Contract'

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'

import MainLayout from './components/MainLayout/MainLayout'
import EventWindow from './workspaces/spells/windows/EventWindow'
import AgentManagerWindow from './workspaces/agents/AgentManagerWindow'
import SettingsWindow from './workspaces/settings/SettingsWindow'

import RequestWindow from './workspaces/spells/windows/RequestWindow'
import { pluginManager } from '@magickml/engine'

const RenderComp = props => {
  return <props.element props={props} />
}

const singleUserMode = import.meta.env.VITE_APP_SINGLE_USER_MODE || true
function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
      {pluginManager.getGroupedClientRoutes().map(pluginRouteGroup => {
          const ClientPageLayout = pluginRouteGroup.layout ?? MagickPageLayout
          return (
            <Route element={<ClientPageLayout />}>
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
        {singleUserMode && (
          <Route path="/settings" element={<SettingsWindow />} />
        )}

        <Route element={<MagickPageLayout />}>
          {/* todo search corpus component */}
          <Route path="/home/*" element={<HomeScreen />} />

          <Route path="/" element={<Magick />} />
          <Route path="/magick/*" element={<Magick />} />
          <Route path="/magick/:URI" element={<Magick />} />
          <Route
            path="/contract/:chain/:address/:function"
            element={<Contract />}
          />
          <Route path="/*" element={<Magick />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
