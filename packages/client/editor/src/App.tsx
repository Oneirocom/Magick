// DOCUMENTED
/**
 * A functional component that renders the 'Routes' component.
 */
import React from 'react'
import Routes from './routes'
import 'reactflow/dist/style.css';
import './behaveFlow.css'
import './App.css'
import './dockview.css'
import enableWhyDidYouRender from './wdyr'

enableWhyDidYouRender(React)

function App(): JSX.Element {
  return <Routes />
}

export default App
