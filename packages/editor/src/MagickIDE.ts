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

import MagickPageLayout from './layouts/MagickPageLayout/MagickPageLayout'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import Magick from './screens/Magick/Magick'

import MainLayout from './layouts/MainLayout/MainLayout'
import EventWindow from './screens/EventWindow'
import RequestWindow from './screens/RequestWindow'
import AgentManagerWindow from './screens/agents/AgentManagerWindow'
import CollectionsWindow from './screens/CollectionsWindow/CollectionsWindow'

/**
 * Exported components
 */

export {
  MagickPageLayout,
  HomeScreen,
  Magick,
  MainLayout,
  EventWindow,
  RequestWindow,
  AgentManagerWindow,
  CollectionsWindow,
}

/**
 * The default entry point for the MagickIDE application.
 */

export default MagickIDE
