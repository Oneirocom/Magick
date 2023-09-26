// DOCUMENTED
import { ClientPluginManager, pluginManager } from '@magickml/core'
import 'flexlayout-react/style/dark.css'
import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import './App.css'
import './design-globals/design-globals.css'
import MagickPageLayout from './layouts/MagickPageLayout/MagickPageLayout'
import MainLayout from './layouts/MainLayout/MainLayout'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import Magick from './screens/Magick/Magick'
import MagickV2 from './screens/MagickV2'
import AgentManagerWindow from './screens/agents/AgentManagerWindow'
import DocumentWindow from './screens/DocumentWindow'
import EventWindow from './screens/EventWindow'
import RequestWindow from './screens/RequestWindow'
import SettingsWindow from './screens/settings/SettingsWindow'
// import ProjectWindow from './windows/ProjectWindow';
import './App.css'
import './design-globals/design-globals.css'

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'

/**
 * A component that renders the given component element with the given props.
 *
 * @param {object} props - The properties to pass to the rendered element.
 * @returns {React.Element} - The rendered React element.
 */
const RenderComp = (props: { element: React.ElementType }) => {
  return <props.element props={props} />
}

/**
 * MyRoutes component handles the routing for the application.
 *
 * @returns {React.Element} - The Routes React element.
 */
const MyRoutes = () => (
  <Routes>
    <Route path="/" element={<MagickV2 />} />
    <Route element={<MainLayout />}>
      {(pluginManager as ClientPluginManager)
        .getGroupedClientRoutes()
        .map(pluginRouteGroup => {
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
        <Route path="/magickV2" element={<MagickV2 />} />
        <Route path="/home/*" element={<HomeScreen />} />
        <Route path="/" element={<MagickV2 />} />
        <Route path="/magick/*" element={<Magick />} />
        <Route path="/magick/:URI" element={<Magick />} />
      </Route>
    </Route>
  </Routes>
)

export default MyRoutes
