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
import { useFeathers } from '@magickml/client-core'
import { Modal } from '@magickml/client-core';
import {
  RootState,
  closeTab,
  selectAllTabs,
  spellApi,
  openTab,
} from '@magickml/core'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'

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
  const { setOpenDoc, setToDelete, setIsAdded } = useTreeData()
  const { enqueueSnackbar } = useSnackbar()
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [isContextMenuOpen, setContextMenuOpen] = useState(false)
  const FeathersContext = useFeathers()
  const client = FeathersContext.client
  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))
  const dispatch = useDispatch()
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(props.node.text)
  const [patchSpell] = spellApi.usePatchSpellMutation()
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  // const [spellToDelete, setSpellToDelete] = useState<string>('');

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    props.onToggle(props.node.id)
  }

  const handleClose = () => {
    setOpenConfirm(false);
  };

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

  const handleConfirmDelete = () => {
    handleDeleteSpell()
  }

  const handleDeleteSpell = async () => {
    if (!props.node) return

    try {
      if (props.node.fileType === 'spell') {
        const spell: any = props.node.id
        navigate('/magick')
        await client.service('spells').remove(props.node.id)
        const tab = tabs.find(tab => tab.id === props.node.id)
        if (tab) {
          dispatch(closeTab(tab.id))
          window.localStorage.removeItem(`zoomValues-${tab.id}`)
        }
        setToDelete(spell)
        setIsAdded(true)
        setContextMenuOpen(false)
      }
    } catch (err) {
      console.error('Error deleting spell', err)
    }
  }

  const handleRenameStart = () => {
    setIsRenaming(true)
    setContextMenuOpen(false)
  }

  const handleRenameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleRename()
    }
  }

  const handleRename = async () => {
    if (!props.node || !newName.trim() || props.node.text === newName) {
      setIsRenaming(false)
      return
    }

    const spell: any = props.node.id
    const response: any = await patchSpell({
      id: props.node.id,
      update: {
        name: newName,
      },
    })

    if (response.error) {
      enqueueSnackbar('Error saving spell', {
        variant: 'error',
      })
      return
    }

    enqueueSnackbar('Spell saved', { variant: 'success' })

    dispatch(closeTab(props.node.id))
    dispatch(
      openTab({
        name: props.node.id + '-' + encodeURIComponent(btoa(newName)),
        spellName: newName,
        type: 'spell',
      })
    )
    setToDelete(spell)
    setIsAdded(true)
    setIsRenaming(false)
  }

  React.useEffect(() => {
    if (isRenaming) {
      const renameInput = document?.querySelector('.rename-input') as HTMLElement
      if (renameInput) renameInput.focus()
    }
  }, [isRenaming])

  return (
    <div
      className={`tree-node ${styles.root}`}
      style={{ paddingInlineStart: indent }}
    >
      <div
        className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ''
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
        {isRenaming ? (
          <input
            type="text"
            className='rename-input'
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleRenameSubmit}
          />
        ) : (
          <Typography
            variant="body1"
            sx={{
              cursor: 'pointer',
              marginLeft: '8px',
            }}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onDoubleClick={handleRenameStart}
          >
            {props.node.text}
          </Typography>
        )}
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
          onClick={e => {
            e.stopPropagation();
            setOpenConfirm(true);
          }}
        >
          <DeleteOutlineTwoToneIcon sx={{ mr: 1 }} />
          <Typography variant="body1">Delete</Typography>
        </MenuItem>
        <MenuItem className={styles.hideMenuItem} onClick={handleRenameStart}>
          <DriveFileRenameOutlineTwoToneIcon sx={{ mr: 1 }} />
          <Typography variant="body1">Rename</Typography>
        </MenuItem>
      </Menu>
      <Modal open={openConfirm}
        onClose={handleClose}
        handleAction={handleConfirmDelete}
        title={`Delete ${props.node.text} spell`}
        submitText="Confirm"
        children="Do you want to delete this spell?" />
    </div>
  )
}
