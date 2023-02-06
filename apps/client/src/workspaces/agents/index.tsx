import { Layout } from '../../workspaces/contexts/LayoutProvider'
import EventHandler from '../../screens/Magick/components/EventHandler'
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
