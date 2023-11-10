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
  </Routes>
)

export default MyRoutes
