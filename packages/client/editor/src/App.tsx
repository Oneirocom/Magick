// DOCUMENTED
/**
 * A functional component that renders the 'Routes' component.
 */
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import MagickV2 from './screens'

import 'dockview/dist/styles/dockview.css'
import './styles/design-globals/design-globals.css'
import 'reactflow/dist/style.css';
import './styles/behaveFlow.css'
import './styles/App.css'
import './styles/dockview.css'

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<MagickV2 />} />
    </Routes>
  )
}

export default App
