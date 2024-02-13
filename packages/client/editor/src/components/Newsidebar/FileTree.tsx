import CssBaseline from '@mui/material/CssBaseline'
import {
  Tree,
  NodeModel,
  MultiBackend,
  getBackendOptions,
} from '@minoru/react-dnd-treeview'
import { DndProvider } from 'react-dnd'
import { useTreeData, useTabLayout, TreeNode } from '@magickml/providers'

import styles from './menu.module.css'
import { CustomNode } from './CustomNode'

type CustomData = {
  fileType: string
  fileSize: string
}

export const FileTree = ({ currentTab }) => {
  const { treeData, setTreeData } = useTreeData()
  const { openTab } = useTabLayout()

  const handleDrop = (newTree: TreeNode[]) => {
    setTreeData(newTree)
  }

  return (
    <div className={`${styles.files} px-4`}>
      <CssBaseline />
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div>
          <Tree
            tree={treeData}
            rootId={0}
            // @ts-ignore
            render={(
              node: NodeModel<CustomData>,
              { depth, isOpen, onToggle }
            ) => (
              <CustomNode
                currentTab={currentTab}
                openTab={openTab}
                node={node}
                depth={depth}
                isOpen={isOpen}
                onToggle={onToggle}
              />
            )}
            // @ts-ignore
            onDrop={handleDrop}
            classes={{
              root: styles.treeRoot,
              draggingSource: styles.draggingSource,
              dropTarget: styles.dropTarget,
            }}
          />
        </div>
      </DndProvider>
    </div>
  )
}
