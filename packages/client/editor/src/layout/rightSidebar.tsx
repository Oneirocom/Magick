import {
  IPaneviewPanelProps,
  PaneviewReact,
  PaneviewReadyEvent,
} from 'dockview'
import { usePanelControls } from '../hooks/usePanelControls'
import LogWindow from '../components/LogWindow/logWindow'
import SeraphWindow from '../components/SeraphWindow/SeraphWindow'
import { useTabLayout } from '@magickml/providers'

const components = {
  default: (props: IPaneviewPanelProps<{ title: string }>) => {
    return (
      <div
        style={{
          padding: '10px',
          height: '100%',
          backgroundColor: 'rgb(60,60,60)',
        }}
      >
        {props.params.title}
      </div>
    )
  },
  LogPanel: (props: IPaneviewPanelProps<{ title: string }>) => {
    return (
      <div
        style={{
          height: '100%',
          background: 'var(--background-color)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <LogWindow />
      </div>
    )
  },
  SeraphWindow: (props: IPaneviewPanelProps<{ spellName: string }>) => {
    return (
      <div
        style={{
          padding: '10px',
          height: '100%',
          backgroundColor: 'rgb(60,60,60)',
        }}
      >
        <SeraphWindow spellName={props.params.spellName} />
      </div>
    )
  },
}

const RightSidebar = props => {
  usePanelControls(props, 'none', 'ctrl+l')
  const tab = useTabLayout()
  const onReady = (event: PaneviewReadyEvent) => {
    event.api.addPanel({
      id: 'Logs',
      component: 'LogPanel',
      params: {
        title: 'Panel 1',
      },
      isExpanded: true,
      title: 'Logs',
    })

    event.api.addPanel({
      id: 'Seraph',
      component: 'SeraphWindow',
      isExpanded: true,
      params: {
        tab,
      },
      title: 'Seraph',
    })
  }

  return (
    <PaneviewReact
      components={components}
      // headerComponents={headerComponents}
      onReady={onReady}
      className="dockview-theme-abyss"
    />
  )
}

export default RightSidebar
