import { TreeDataProvider, usePubSub } from '@magickml/providers'
import { IGridviewPanelProps } from 'dockview'
import { NewSidebar } from '../../../components/Newsidebar'
import { useGlobalLayout } from '../../../contexts/GlobalLayoutProvider'
import { useDrawerAnimation } from '../hooks/useDrawerAnimation'

const ANIMATION_DURATION = 300
const INITIAL_SIZE = 200

const FileDrawer = (props: IGridviewPanelProps<{ title: string, id: string }>) => {

  const { events } = usePubSub()
  const { setResizing } = useGlobalLayout()

  useDrawerAnimation(props, INITIAL_SIZE, ANIMATION_DURATION, events.TOGGLE_FILE_DRAWER, 'ctrl+b');

  return (
    <div style={{ height: '100%' }}>
      <TreeDataProvider>
        <NewSidebar />
      </TreeDataProvider>
    </div>
  )
}

export default FileDrawer
