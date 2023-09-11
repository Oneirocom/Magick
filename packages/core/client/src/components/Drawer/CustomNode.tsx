import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import { NodeModel } from '@minoru/react-dnd-treeview'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AddIcon from '@mui/icons-material/Add'
import { TypeIcon } from './TypeIcon'
import styles from './menu.module.css'
import { useNavigate } from 'react-router-dom'
import { useTreeData } from '../../contexts/TreeDataProvider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import DriveFileRenameOutlineTwoToneIcon from '@mui/icons-material/DriveFileRenameOutlineTwoTone'
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone'
import { useConfig, useFeathers } from '@magickml/client-core'
import { closeTab, selectAllTabs } from '../../../../../editor/src/state/tabs'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../../editor/src/state/store'

type ExtendedNodeModel = NodeModel & CustomData

type Props = {
  node: ExtendedNodeModel
  depth: number
  isOpen: boolean
  onToggle: (id: NodeModel['id']) => void
}

type CustomData = {
  fileType?: string
  fileSize?: string
}

export const CustomNode: React.FC<Props> = props => {
  const { droppable, data }: any = props.node
  const indent = props.depth * 24
  const navigate = useNavigate()
  const { setOpenDoc, setToDelete,setIsAdded } = useTreeData()
  // State variables for the custom context menu
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [isContextMenuOpen, setContextMenuOpen] = useState(false)
  const FeathersContext = useFeathers()
  const client = FeathersContext.client
  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))
  const dispatch = useDispatch()

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    props.onToggle(props.node.id)
  }

  const handleClick = () => {
    if (!props.node) return
    if (props.node.fileType === 'txt') {
      setOpenDoc(props.node.id)
      navigate(`/magick/Documents-${encodeURIComponent(btoa('Documents'))}`)
    } else if (props.node.fileType === 'spell') {
      navigate(
        `/magick/${props.node.id}-${encodeURIComponent(btoa(props.node.text))}`
      )
    }
  }

  const handleOpenSpell = () => {
    navigate('/home/create-new')
  }
  // Close the context menu when clicking outside of it
  const handleContextMenuClose = () => {
    setContextMenuOpen(false)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent the default behavior of the right-click (context menu).
    if (!props.node) return
    setContextMenuPosition({ x: e.clientX, y: e.clientY })

    // Open the custom context menu
    setContextMenuOpen(true)
  }
  const handleDeleteSpell = async (e) => {
    if (!props.node) return
    e.stopPropagation()
   
    try {
      if (props.node.fileType === 'spell') {
        const spell: any = props.node.id
        await client.service('spells').remove(props.node.id)
        const tab = tabs.find(tab => tab.id === props.node.id)
        if (tab) {
          dispatch(closeTab(tab.id))
          window.localStorage.removeItem(`zoomValues-${tab.id}`)
          navigate('/magick')
        }
        setToDelete(spell)
        setIsAdded(true)
        setContextMenuOpen(false)
      }
    } catch (err) {
      console.error('Error deleting spell', err)
    }
  }

  return (
    <div
      className={`tree-node ${styles.root}`}
      style={{ paddingInlineStart: indent }}
    >
      <div
        className={`${styles.expandIconWrapper} ${
          props.isOpen ? styles.isOpen : ''
        }`}
      >
        {props.node.droppable && (
          <div onClick={handleToggle}>
            <ChevronRightIcon />
          </div>
        )}
      </div>
      <div>
        <TypeIcon
          droppable={droppable}
          fileType={data ? data.fileType : props.node.fileType}
        />
      </div>
      <div className={styles.labelGridItem}>
        <Typography
          variant="body1"
          sx={{
            cursor: 'pointer',
            marginLeft: '8px',
          }}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
        >
          {props.node.text}
        </Typography>
      </div>
      <div
        className={`${styles.expandIconWrapper} 
          }`}
      >
        {props.node.text === 'Spells & Prompts' && (
          <div onClick={handleOpenSpell}>
            <AddIcon />
          </div>
        )}
      </div>
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenuPosition
            ? { top: contextMenuPosition.y, left: contextMenuPosition.x }
            : undefined
        }
        open={isContextMenuOpen}
        onClose={handleContextMenuClose}
        sx={{
          '& .MuiMenu-paper': {
            background: '#2a2a2a',
            width: '180px',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '5px',
          },
        }}
      >
        <MenuItem
          className={styles.hideMenuItem}
          onClick={(e) => handleDeleteSpell(e)}
        >
          <DeleteOutlineTwoToneIcon sx={{ mr: 1 }} />
          <Typography variant="body1">Delete</Typography>
        </MenuItem>
        <MenuItem className={styles.hideMenuItem}>
          <DriveFileRenameOutlineTwoToneIcon sx={{ mr: 1 }} />
          <Typography variant="body1">Rename</Typography>
        </MenuItem>
      </Menu>
    </div>
  )
}
