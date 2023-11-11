import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import { NodeModel } from '@minoru/react-dnd-treeview'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AddIcon from '@mui/icons-material/Add'
import styles from './menu.module.css'
import { useTabLayout, useTreeData } from '@magickml/providers'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import DriveFileRenameOutlineTwoToneIcon from '@mui/icons-material/DriveFileRenameOutlineTwoTone'
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone'
import { Modal } from 'client/core'
import {
  spellApi,
  Tab,
} from 'client/state'
import { useSnackbar } from 'notistack'

import { TypeIcon } from 'client/core'
import { useModal } from '../../contexts/ModalProvider'

type ExtendedNodeModel = NodeModel & CustomData

type Props = {
  node: ExtendedNodeModel
  depth: number
  isOpen: boolean
  currentTab: Tab
  onToggle: (id: NodeModel['id']) => void
  openTab: (tab: any) => void
}

type CustomData = {
  fileType?: string
  fileSize?: string
}

export const CustomNode: React.FC<Props> = props => {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(props.node.text)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [isContextMenuOpen, setContextMenuOpen] = useState(false)
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)

  const [patchSpell] = spellApi.usePatchSpellMutation()
  const [deleteSpell] = spellApi.useDeleteSpellMutation()

  const { openModal } = useModal()
  const { setOpenDoc } = useTreeData()
  const { enqueueSnackbar } = useSnackbar()
  const { renameTab } = useTabLayout()

  const indent = props.depth * 24
  const { droppable, data }: any = props.node

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    props.onToggle(props.node.id)
  }

  const handleClose = () => {
    setOpenConfirm(false)
  }

  const handleOpenDocTab = () => {
    setOpenDoc(props.node.id)
    props.openTab({
      id: 'Documents',
      name: 'Documents',
      type: 'Documents',
      switchActive: true,
    })
  }

  const handleOpenSpellTab = () => {
    props.openTab({
      id: props.node.text,
      name: props.node.text,
      spellName: props.node.text,
      type: 'spell',
      params: {
        spellId: props.node.id,
      }
    })
  }

  const handleOpenSpellV2Tab = () => {
    props.openTab({
      id: props.node.text,
      name: props.node.text,
      spellName: props.node.text,
      type: 'spellV2',
      params: {
        spellId: props.node.id,
      }
    })
  }


  const handleClick = () => {
    if (!props.node) return

    switch (props.node.fileType) {
      case 'txt':
        handleOpenDocTab()
        break
      case 'spell':
        handleOpenSpellTab()
        break
      case 'spellV2':
        handleOpenSpellV2Tab()
        break
      default:
        break
    }
  }

  const handleOpenSpell = () => {
    openModal({
      modal: 'createSpellModal',
    })
  }
  // Close the context menu when clicking outside of it
  const handleContextMenuClose = () => {
    setContextMenuOpen(false)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent the default behavior of the right-click (context menu).
    if (!props.node) return
    if (props.node.fileType !== 'txt' && props.node.fileType !== 'spell') return
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
        const spellId: any = props.node.id

        await deleteSpell({ spellId })
          .unwrap()

        setContextMenuOpen(false)
        enqueueSnackbar('Spell successfully deleted', {
          variant: 'success',
        })
      }
    } catch (err) {
      console.error('Error deleting spell', err)
      enqueueSnackbar('Error deleting spell', {
        variant: 'error',
      })
    }

    handleClose()
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

    try {
      await patchSpell({
        id: props.node.id,
        update: {
          name: newName,
        },
      }).unwrap()

      renameTab(props.currentTab.id, newName)

      enqueueSnackbar('Spell saved', { variant: 'success' })
      setIsRenaming(false)

    } catch (err) {
      console.error("error saving spell", err)
      enqueueSnackbar('Error saving spell', {
        variant: 'error',
      })
    }
  }

  const setClassSelectedFile = () => {
    if (props.currentTab?.id === 'Documents') return

    return props.currentTab?.id === props.node.text ? styles.isSelected : ''
  }

  useEffect(() => {
    if (isRenaming) {
      const renameInput = document?.querySelector(
        '.rename-input'
      ) as HTMLElement
      if (renameInput) renameInput.focus()
    }
  }, [isRenaming])

  // useEffect(() => {
  //   setIsRenaming(false)
  // }, [props.node, newName])

  return (
    <div
      className={`tree-node ${styles.root}`}
      style={{ paddingInlineStart: indent, cursor: 'pointer', width: '200%' }}
      onClick={handleToggle}
    >
      <div
        className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ''}`}
      >
        {props.node.droppable && (
          <div>
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
            className="rename-input"
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
              whiteSpace: 'nowrap',
            }}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onDoubleClick={handleRenameStart}
            className={setClassSelectedFile()}
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
            e.stopPropagation()
            setOpenConfirm(true)
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
      <Modal
        open={openConfirm}
        onClose={handleClose}
        handleAction={handleConfirmDelete}
        title={`Delete ${props.node.text} spell`}
        submitText="Confirm"
        children="Do you want to delete this spell?"
      />
    </div>
  )
}
