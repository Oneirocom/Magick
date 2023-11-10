// DOCUMENTED
/**
 * The main entry point for the MagickIDE application.
 *
 * @module MagickIDE
 */

import { MagickIDE } from './main'
import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'
import './App.css'

import Magick from './screens/MagickV2'

import EventWindow from './screens/MagickV2/screens/EventWindow'
import RequestWindow from './screens/MagickV2/screens/RequestWindow'
import AgentManagerWindow from './screens/MagickV2/screens/agents/AgentManagerWindow'

/**
 * Exported components
 */

export { Magick, EventWindow, RequestWindow, AgentManagerWindow }

/**
 * The default entry point for the MagickIDE application.
 */

export default MagickIDE
