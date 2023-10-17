import {
  DockviewReadyEvent,
  GridviewApi,
  GridviewReact,
  GridviewReadyEvent,
  IGridviewPanelProps,
  LayoutPriority,
  Orientation,
} from 'dockview'
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useGlobalLayout } from '../../contexts/GlobalLayoutProvider'
import MainPanel from './panels/mainPanel'
import FileDrawer from './panels/fileDrawer'
import RightSidebar from './panels/rightSidebar'
import { RootState, useDockviewTheme } from 'client/state'
import ModalProvider from '../../contexts/ModalProvider'
import { useSelector } from 'react-redux'

const components = {
  MainPanel,
  FileDrawer,
  RightSidebar,
  StatusBar: (props: IGridviewPanelProps<{ title: string }>) => {
    const { currentTab } = useSelector((state: RootState) => state.tabLayout)
    const { syncing, connected } = useSelector((state: RootState) => state.statusBar)

    return (
      <div
        style={{
          height: '100%',
          padding: '0px 10px',
          background: 'var(--dv-group-view-background-color)',
          borderTop: '1px solid var(--deep-background-color)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <span style={{ color: connected ? 'green' : 'red', marginRight: 20 }}>●</span>
        <p>Syncing: </p>
        <AutorenewIcon
          sx={{
            marginRight: "20px",
            animation: syncing ? "spin 2s linear infinite" : "none",
            "@keyframes spin": {
              "0%": {
                transform: "rotate(0deg)",
              },
              "100%": {
                transform: "rotate(230deg)",
              },
            },
          }}
        />
        <p>
          Current Tab: {currentTab?.title}
        </p>
      </div>
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
  // api.addPanel({
  //   id: 'RightSidebar',
  //   component: 'RightSidebar',
  //   params: {
  //     title: 'Panel 6',
  //     id: 'RightSidebar'
  //   },
  //   snap: true,
  //   minimumWidth: 50,
  //   priority: LayoutPriority.Low,
  //   position: { referencePanel: 'MainPanel', direction: 'right' },
  // })
}

const MagickV2 = () => {
  const { getLayout, setApi } = useGlobalLayout()
  const { theme } = useDockviewTheme()

  console.log("THEME", theme)

  const onReady = (event: GridviewReadyEvent) => {
    const layout = getLayout()

    let success = false

    // if (layout) {
    //   event.api.fromJSON(layout)
    //   success = true
    // }

    if (!success) {
      loadDefaultLayout(event.api)
    }

    setApi(event.api)
  }

  return (
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
  )
}

export default MagickV2
