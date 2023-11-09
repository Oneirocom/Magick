import {
  GridviewApi,
  GridviewReact,
  GridviewReadyEvent,
  IGridviewPanelProps,
  LayoutPriority,
  Orientation,
} from 'dockview'
import { useGlobalLayout } from '../../contexts/GlobalLayoutProvider'
import MainPanel from './layout/mainPanel'
import FileDrawer from './layout/fileDrawer'
import RightSidebar from './layout/rightSidebar'
import { useDockviewTheme } from 'client/state'
import ModalProvider from '../../contexts/ModalProvider'
import { StatusBar } from './components/StatusBar/statusBar';
import { ReactFlowProvider } from 'reactflow'

const components = {
  MainPanel,
  FileDrawer,
  RightSidebar,
  StatusBar: (props: IGridviewPanelProps<{ title: string }>) => {
    return (
      <StatusBar />
    )
  },
  default: (props: IGridviewPanelProps<{ title: string }>) => {
    return (
      <div
        style={{
          height: '100%',
          padding: '5px',
          background: 'var(--dv-group-view-background-color)',
        }}
      >
        Status Bar
      </div>
    )
  }
}

const loadDefaultLayout = (api: GridviewApi) => {
  // Bottom status bar
  api.addPanel({
    id: 'StatusBar',
    component: 'StatusBar',
    params: {
      title: 'StatusBar',
    },
    maximumHeight: 30,
    minimumHeight: 30,
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
    priority: LayoutPriority.High,
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
    snap: true,
    minimumWidth: 50,
    priority: LayoutPriority.Low,
    position: { referencePanel: 'MainPanel', direction: 'right' },
  })
}

const MagickV2 = () => {
  const { getLayout, setApi } = useGlobalLayout()
  const { theme } = useDockviewTheme()

  console.log("THEME", theme)

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
    <ReactFlowProvider>
      <ModalProvider>
        <GridviewReact
          components={components}
          onReady={onReady}
          disableAutoResizing={false}
          proportionalLayout={false}
          orientation={Orientation.VERTICAL}
          hideBorders={true}
          className={`global-layout ${theme}`}
        />
      </ModalProvider>
    </ReactFlowProvider>
  )
}

export default MagickV2
