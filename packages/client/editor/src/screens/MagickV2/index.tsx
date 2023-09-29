import {
  DockviewReadyEvent,
  GridviewApi,
  GridviewReact,
  GridviewReadyEvent,
  IGridviewPanelProps,
  Orientation,
} from 'dockview'
import { useGlobalLayout } from '../../contexts/GlobalLayoutProvider'
import MainPanel from './panels/mainPanel'
import FileDrawer from './panels/fileDrawer'
import RightSidebar from './panels/rightSidebar'

const components = {
  MainPanel,
  FileDrawer,
  RightSidebar,
  default: (props: IGridviewPanelProps<{ title: string }>) => {
    return (
      <div
        style={{
          height: '100%',
          padding: '20px',
          background: 'var(--dv-group-view-background-color)',
        }}
      >
        {JSON.stringify(props.params)}
      </div>
    )
  }
}

const loadDefaultLayout = (api: GridviewApi) => {
  // Bottom status bar
  api.addPanel({
    id: 'StatusBar',
    component: 'default',
    params: {
      title: 'StatusBar',
    },
    maximumHeight: 15,
    minimumHeight: 15,
  })

  // Left side file drawer
  api.addPanel({
    id: 'FileDrawer',
    component: 'FileDrawer',
    maximumWidth: 300,
    params: {
      title: 'FileDrawer',
      id: 'FileDrawer'
    },
  })

  // Main panel in the in the middle
  api.addPanel({
    id: 'MainPanel',
    component: 'MainPanel',
    params: {
      title: 'MainPanel',
      idL: 'MainPanel'
    },
    position: { referencePanel: 'FileDrawer', direction: 'right' },
  })

  // Right side console panel
  api.addPanel({
    id: 'RightSidebar',
    component: 'RightSidebar',
    params: {
      title: 'Panel 6',
      id: 'RightSidebar'
    },
    minimumWidth: 5,
    position: { referencePanel: 'MainPanel', direction: 'right' },
  })
}

const MagickV2 = () => {
  const { getLayout, setApi } = useGlobalLayout()

  const onReady = (event: GridviewReadyEvent) => {
    const layout = getLayout()

    let success = false

    if (layout) {
      event.api.fromJSON(layout)
      success = true
    }

    if (!success) {
      loadDefaultLayout(event.api)
    }

    setApi(event.api)
  }

  return (
    <GridviewReact
      components={components}
      onReady={onReady}
      disableAutoResizing={false}
      proportionalLayout={true}
      orientation={Orientation.VERTICAL}
      className="dockview-theme-abyss"
    />
  )
}

export default MagickV2
