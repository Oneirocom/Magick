import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import MagickPageLayout from './components/MagickPageLayout/MagickPageLayout'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import Magick from './screens/Magick/Magick'

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'
import './App.css'

import MainLayout from './components/MainLayout/MainLayout'

//These need to be imported last to override styles.

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/fineTuneManager" element={<></>} />
        <Route element={<MagickPageLayout />}>
          <Route path="/home/*" element={<HomeScreen />} />
          <Route path="/" element={<Magick />} />
          <Route path="/magick/*" element={<Magick />} />
          <Route path="/magick/:spellName" element={<Magick />} />
          <Route path="/*" element={<Magick />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
