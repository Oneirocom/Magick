// DOCUMENTED
import 'flexlayout-react/style/dark.css'
import { Route, Routes } from 'react-router-dom'

import './App.css'
import './design-globals/design-globals.css'
import MagickV2 from './screens/MagickV2'
import './App.css'
import './design-globals/design-globals.css'

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'

/**
 * MyRoutes component handles the routing for the application.
 *
 * @returns {React.Element} - The Routes React element.
 */
const MyRoutes = () => (
  <Routes>
    <Route path="/" element={<MagickV2 />} />
  </Routes>
)

export default MyRoutes
