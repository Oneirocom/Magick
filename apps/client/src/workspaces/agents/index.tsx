import { Layout } from '../../workspaces/contexts/LayoutProvider'
import EventHandler from '../../screens/Magick/components/EventHandler'
import StateManager from '../../workspaces/spells/windows/StateManagerWindow'
import SearchCorpus from '../search/SearchCorpusWindow'

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
        case 'searchCorpus':
          return <SearchCorpus />
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
