import {
  GridviewApi,
  GridviewReact,
  GridviewReadyEvent,
  IGridviewPanelProps,
  Orientation,
} from 'dockview'
import MainPanel from './panels/mainPanel'
import FileDrawer from './panels/fileDrawer'

const components = {
  MainPanel,
  FileDrawer,
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
  },
}

const loadDefaultLayout = (api: GridviewApi) => {
  // Bottom status bar
  api.addPanel({
    id: 'panel_1',
    component: 'default',
    params: {
      title: 'Panel 1',
    },
    maximumHeight: 15,
    minimumHeight: 15,
  })

  // Left side file drawer
  api.addPanel({
    id: 'panel_3',
    component: 'FileDrawer',
    maximumWidth: 300,
    params: {
      title: 'Panel 3',
    },
  })

  // Main panel in the in the middle
  api.addPanel({
    id: 'panel_5',
    component: 'MainPanel',
    params: {
      title: 'Panel 5',
    },
    position: { referencePanel: 'panel_3', direction: 'right' },
  })

  // Right side console panel
  // api.addPanel({
  //   id: 'panel_6',
  //   component: 'default',
  //   params: {
  //     title: 'Panel 6',
  //   },
  //   position: { referencePanel: 'panel_5', direction: 'right' },
  // }).api.setSize({
  //   width: 5
  // });
}

const MagickV2 = () => {
  const onReady = (event: GridviewReadyEvent) => {
    loadDefaultLayout(event.api)
  }

  return (
    <GridviewReact
      components={components}
      onReady={onReady}
      proportionalLayout={false}
      orientation={Orientation.VERTICAL}
      className="dockview-theme-abyss"
    />
  )
}

export default MagickV2
