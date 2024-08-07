'use client'

import {
  GridviewApi,
  GridviewReact,
  GridviewReadyEvent,
  IGridviewPanelProps,
  LayoutPriority,
  Orientation,
} from 'dockview'
import { useGlobalLayout } from '../contexts/GlobalLayoutProvider'
import MainPanel from '../layout/mainPanel'
import FileDrawer from '../layout/fileDrawer'
import RightSidebar from '../layout/rightSidebar'
import { setActiveInput, useDockviewTheme, useGetUserQuery } from 'client/state'
import ModalProvider from '../contexts/ModalProvider'
import { StatusBar } from '../components/StatusBar/statusBar'
import { useConfig } from '@magickml/providers'
import posthog from 'posthog-js'
import { useDispatch } from 'react-redux'

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
      id: 'FileDrawer',
    },
  })

  // Main panel in the in the middle
  api.addPanel({
    id: 'MainPanel',
    component: 'MainPanel',
    params: {
      title: 'MainPanel',
      id: 'MainPanel',
    },
    priority: LayoutPriority.High,
    position: { referencePanel: 'FileDrawer', direction: 'right' },
  })

  // Right side console panel
  api
    .addPanel({
      id: 'RightSidebar',
      component: 'RightSidebar',
      params: {
        title: 'Panel 6',
        id: 'RightSidebar',
      },
      snap: true,
      priority: LayoutPriority.Low,
      position: { referencePanel: 'MainPanel', direction: 'right' },
    })
    .api.setSize({
      width: 0,
    })
}

const MagickV2 = () => {
  const { getLayout, setApi } = useGlobalLayout()
  const { theme } = useDockviewTheme()
  const config = useConfig()
  const { data: userData, isLoading } = useGetUserQuery({
    projectId: config.projectId,
  })
  const dispatch = useDispatch()

  if (isLoading) return null

  posthog.setPersonPropertiesForFlags({ email: userData?.user?.email })

  const withClickHandler = (WrappedComponent: React.ComponentType<any>) => {
    return (props: IGridviewPanelProps<{ title: string }>) => {
      const handleClick = (e: React.MouseEvent) => {
        dispatch(setActiveInput(null))
      }

      return (
        <div onClick={handleClick} style={{ height: '100%', width: '100%' }}>
          <WrappedComponent {...props} />
        </div>
      )
    }
  }

  const components = {
    MainPanel: MainPanel,
    FileDrawer: withClickHandler(FileDrawer),
    RightSidebar: withClickHandler(RightSidebar),
    StatusBar: withClickHandler(
      (props: IGridviewPanelProps<{ title: string }>) => {
        return <StatusBar />
      }
    ),
    default: withClickHandler(
      (props: IGridviewPanelProps<{ title: string }>) => {
        return (
          <div
            style={{
              height: '100%',
              padding: '5px',
              background: 'var(--background-color)',
            }}
          >
            Status Bar
          </div>
        )
      }
    ),
  }

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
