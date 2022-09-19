import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import RequireAuth from './components/RequireAuth/RequireAuth'
import ThothPageWrapper from './components/ThothPage/ThothPageWrapper'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import Admin from './screens/Admin/routes'
import Thoth from './screens/Thoth/Thoth'
import { useAuth } from './contexts/AuthProvider'

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'
import './App.css'
import { activeTabSelector, selectAllTabs } from './state/tabs'
import { useSelector } from 'react-redux'
import { RootState } from './state/store'
import { useLatitude } from './config'

//These need to be imported last to override styles.

function App() {
  // Use our routes
  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))
  const activeTab = useSelector(activeTabSelector)
  const { user } = useAuth()

  const redirect = () => {
    if ((!useLatitude || user) && tabs.length > 0) {
      return <Navigate to="/thoth" />
    }

    return !useLatitude || user ? (
      <Navigate to="/home" />
    ) : (
      <Navigate to="/login" />
    )
  }

  return (
    <ThothPageWrapper tabs={tabs} activeTab={activeTab}>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/thoth" element={<Thoth />} />
          <Route path="/thoth/:spellName" element={<Thoth />} />
          <Route path="/home/*" element={<HomeScreen />} />
          <Route
            path="admin/*"
            element={
              <React.Suspense fallback={<>...</>}>
                <Admin />
              </React.Suspense>
            }
          />
          <Route path="/" element={redirect()} />
        </Route>
      </Routes>
    </ThothPageWrapper>
  )
}

export default App
