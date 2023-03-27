import { pluginManager } from '@magickml/engine'
import 'flexlayout-react/style/dark.css'
import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import './App.css'
import MagickPageLayout from './layouts/MagickPageLayout/MagickPageLayout'
import MainLayout from './layouts/MainLayout/MainLayout'
import './design-globals/design-globals.css'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import Magick from './screens/Magick/Magick'
import AgentManagerWindow from './windows/agents/AgentManagerWindow'
import DocumentWindow from './windows/DocumentWindow'
import EventWindow from './windows/EventWindow'
import RequestWindow from './windows/RequestWindow'
import SettingsWindow from './windows/settings/SettingsWindow'
// import ProjectWindow from './windows/ProjectWindow'

const RenderComp = props => {
  return <props.element props={props} />
}

const MyRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
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
      <Route path="/documents" element={<DocumentWindow />} />
      <Route path="/events" element={<EventWindow />} />
      <Route path="/requests" element={<RequestWindow />} />
      <Route path="/agents" element={<AgentManagerWindow />} />
      <Route path="/settings" element={<SettingsWindow />} />

      <Route element={<MagickPageLayout />}>
        <Route path="/home/*" element={<HomeScreen />} />
        <Route path="/" element={<Magick />} />
        <Route path="/magick/*" element={<Magick />} />
        <Route path="/magick/:URI" element={<Magick />} />
      </Route>
    </Route>
  </Routes>
)

export default MyRoutes
