import MagickIDE from "./main";

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'
import "./App.css"

import MagickPageLayout from './components/MagickPageLayout/MagickPageLayout'

import HomeScreen from './screens/HomeScreen/HomeScreen'
import Magick from './screens/Magick/Magick'
import Contract from './screens/Contract/Contract'

import MainLayout from './components/MainLayout/MainLayout'
import EventWindow from './workspaces/spells/windows/EventWindow'
import RequestWindow from './workspaces/spells/windows/RequestWindow'
import AgentManagerWindow from './workspaces/agents/AgentManagerWindow'
export type { MagickIDEProps } from "./main";

export {
    MagickPageLayout,
    HomeScreen,
    Magick,
    Contract,
    MainLayout,
    EventWindow,
    RequestWindow,
    AgentManagerWindow,
}

export default MagickIDE;