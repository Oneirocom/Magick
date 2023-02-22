import MagickIDE from "./main";
export type { MagickIDEProps } from "./main";

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'
import "./App.css"

import MagickPageLayout from './components/MagickPageLayout/MagickPageLayout'
import FineTuneManagerLayout from './screens/FineTuneManager/PageLayout'

import HomeScreen from './screens/HomeScreen/HomeScreen'
import Magick from './screens/Magick/Magick'
import Contract from './screens/Contract/Contract'

import MainLayout from './components/MainLayout/MainLayout'
import EventWindow from './workspaces/spells/windows/EventWindow'
import RequestWindow from './workspaces/spells/windows/RequestWindow'
import AgentManagerWindow from './workspaces/agents/AgentManagerWindow'

import FineTuneManager from './screens/FineTuneManager/FineTuneManager'
import Completions from './screens/FineTuneManager/completions'
import NewFineTune from './screens/FineTuneManager/screens/NewFineTune'
import CompletionDetails from './screens/FineTuneManager/completions/CompletionDetails'

export {
    MagickPageLayout,
    HomeScreen,
    Magick,
    Contract,
    FineTuneManagerLayout,
    MainLayout,
    EventWindow,
    RequestWindow,
    AgentManagerWindow,
    FineTuneManager,
    Completions,
    NewFineTune,
    CompletionDetails
}

export default MagickIDE;