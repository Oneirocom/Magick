import { MagickIDE } from './main'

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'
import './App.css'

import MagickPageLayout from './layouts/MagickPageLayout/MagickPageLayout'

import HomeScreen from './screens/HomeScreen/HomeScreen'
import Magick from './screens/Magick/Magick'

import MainLayout from './layouts/MainLayout/MainLayout'
import EventWindow from './windows/EventWindow'
import RequestWindow from './windows/RequestWindow'
import AgentManagerWindow from './windows/agents/AgentManagerWindow'

export {
  MagickPageLayout,
  HomeScreen,
  Magick,
  MainLayout,
  EventWindow,
  RequestWindow,
  AgentManagerWindow,
}

export default MagickIDE
