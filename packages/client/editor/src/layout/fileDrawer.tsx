import { TreeDataProvider, usePubSub } from '@magickml/providers'
import { IGridviewPanelProps } from 'dockview'
import { NewSidebar } from '../components/Newsidebar'
import { usePanelControls } from '../hooks/usePanelControls'

const FileDrawer = (props: IGridviewPanelProps<{ title: string, id: string }>) => {

  const { events } = usePubSub()

  usePanelControls(props, events.TOGGLE_FILE_DRAWER, 'ctrl+b');

  return (
    <div style={{ height: '100%', background: "var(--background-color)" }}>
      <TreeDataProvider>
        <NewSidebar />
      </TreeDataProvider>
    </div>
  )
}

export default FileDrawer

