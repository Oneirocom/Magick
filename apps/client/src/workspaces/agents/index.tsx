import { Layout } from '@/workspaces/contexts/LayoutProvider'
import EventHandler from '@/screens/Thoth/components/EventHandler'
import StateManager from '@/workspaces/spells/windows/StateManagerWindow'
import { CalendarApp } from '@/screens/Calendar/Calendar'
import EntityManagerWindow from './windows/EntityManagerWindow'
import GreetingsManagerWindow from './windows/GreetingsManagerWindow'
import SearchCorpus from './windows/SearchCorpusWindow'
import VideoTranscription from './windows/VideoTranscription'
import MessageReactionEditor from './windows/MessageReactionEditor'
import WysiwygEditor from './windows/WysiwygEditor'

const Workspace = ({ tab, pubSub }) => {
  const factory = tab => {
    return node => {
      const props = {
        tab,
        node,
      }
      const component = node.getComponent()
      switch (component) {
        case 'stateManager':
          return <StateManager {...props} />
        case 'wysiwygEditor':
          return <WysiwygEditor {...props} />
        case 'searchCorpus':
          return <SearchCorpus />
        case 'entityManager':
          return <EntityManagerWindow />
        case 'greetingsManager':
          return <GreetingsManagerWindow />
        case 'videoTranscription':
          return <VideoTranscription />
        case 'calendarTab':
          return <CalendarApp />
        case 'messageReactionEditor':
          return <MessageReactionEditor />
        default:
          return <p></p>
      }
    }
  }

  return (
    <>
      <EventHandler tab={tab} pubSub={pubSub} />
      <Layout json={tab.layoutJson} factory={factory(tab)} tab={tab} />
    </>
  )
}

const Wrapped = props => {
  return <Workspace {...props} />
}

export default Wrapped
