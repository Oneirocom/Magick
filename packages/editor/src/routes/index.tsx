import { Route, Switch } from 'react-router-dom';

import MagickPageLayout from './components/MagickPageLayout/MagickPageLayout'
import FineTuneManagerLayout from './screens/FineTuneManager/PageLayout'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import Magick from './screens/Magick/Magick'
import Contract from './screens/Contract/Contract'
import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'
import MainLayout from './components/MainLayout/MainLayout'
import EventWindow from './workspaces/spells/windows/EventWindow'
import AgentManagerWindow from './workspaces/agents/AgentManagerWindow'
import SettingsWindow from './workspaces/settings/SettingsWindow'
import FineTuneManager from './screens/FineTuneManager/FineTuneManager'
import Completions from './screens/FineTuneManager/completions'
import NewFineTune from './screens/FineTuneManager/screens/NewFineTune'
import CompletionDetails from './screens/FineTuneManager/completions/CompletionDetails'
import RequestWindow from './workspaces/spells/windows/RequestWindow'



const singleUserMode = import.meta.env.VITE_APP_SINGLE_USER_MODE || true;

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Magick} />
    <Route exact path="/home/*" component={HomeScreen} />
    <Route exact path="/magick/*" component={Magick} />
    <Route exact path="/magick/:spellName" component={Magick} />
    <Route exact path="/contract/:chain/:address/:function" component={Contract} />
    <Route exact path="/events" component={EventWindow} />
    <Route exact path="/requests" component={RequestWindow} />
    <Route exact path="/agents" component={AgentManagerWindow} />
    {singleUserMode && <Route exact path="/settings" component={SettingsWindow} />}
    <Route exact path="/fineTuneManager" component={FineTuneManager} />
    <Route exact path="/fineTuneManager/completions" component={Completions} />
    <Route exact path="/fineTuneManager/fine-tunes/new" component={NewFineTune} />
    <Route exact path="/fineTuneManager/fine-tune/:fineTuneId" component={CompletionDetails} />
  </Switch>
);


export default Routes;
