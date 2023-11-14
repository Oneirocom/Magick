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
import { useModal } from '../../contexts/ModalProvider'

type CustomData = {
  fileType: string
  fileSize: string
}

export const FileTree = ({ currentTab }) => {
  const { treeData, setTreeData } = useTreeData()
  const { openTab } = useTabLayout()
  const { openModal } = useModal()

  const handleDrop = (newTree: TreeNode[]) => {
    setTreeData(newTree)
  }

  const onCreateSpell = () => {
    openModal({
      modal: 'createSpellModal',
    })
  }

  return (<div className={`${styles.files} px-4`} >
    <CssBaseline />
    <button onClick={onCreateSpell} className="p-4 w-full mb-4">+ Create spell</button>
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
          onDrop={handleDrop}
          classes={{
            root: styles.treeRoot,
            draggingSource: styles.draggingSource,
            dropTarget: styles.dropTarget,
          }}
        />
      </div>
    </DndProvider>
  </div>)
}