import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import MagickPageLayout from './components/MagickPageLayout/MagickPageLayout'
import FineTuneManagerLayout from './screens/FineTuneManager/PageLayout'

import HomeScreen from './screens/HomeScreen/HomeScreen'
import Magick from './screens/Magick/Magick'
import Contract from './screens/Contract/Contract'

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'
import './App.css'

import MainLayout from './components/MainLayout/MainLayout'
import EventManagerWindow from './workspaces/spells/windows/EventManager'
import AgentManagerWindow from './workspaces/agents/windows/AgentManagerWindow'

import FineTuneManager from './screens/FineTuneManager/FineTuneManager'
import Completions from './screens/FineTuneManager/completions'
import NewFineTune from './screens/FineTuneManager/screens/NewFineTune'
import CompletionDetails from './screens/FineTuneManager/completions/CompletionDetails'

//These need to be imported last to override styles.

function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route element={<FineTuneManagerLayout />}>
          <Route path="/fineTuneManager" element={<FineTuneManager />} />
          <Route
            path="/fineTuneManager/completions"
            element={<Completions />}
          />
          <Route
            path="/fineTuneManager/fine-tunes/new"
            element={<NewFineTune />}
          />
          <Route
            path="/fineTuneManager/fine-tune/:fineTuneId"
            element={<CompletionDetails />}
          />
        </Route>
        <Route element={<MagickPageLayout />}>
          <Route path="/events" element={<EventManagerWindow />} />
          <Route path="/agents" element={<AgentManagerWindow />} />
          <Route path="/home/*" element={<HomeScreen />} />


          <Route path="/" element={<Magick />} />
          <Route path="/magick/*" element={<Magick />} />
          <Route path="/magick/:spellName" element={<Magick />} />
          <Route path="/contract/:chain/:address/:function" element={<Contract />} />
          <Route path="/*" element={<Magick />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
