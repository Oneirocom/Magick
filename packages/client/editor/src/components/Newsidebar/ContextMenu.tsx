import Menu from "@mui/material/Menu"
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import StarBorderPurple500OutlinedIcon from '@mui/icons-material/StarBorderPurple500Outlined'
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'
import { useEffect, useState } from "react"
import styles from './menu.module.css'
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import { useTabLayout } from '@magickml/providers'
import { useModal } from "../../contexts/ModalProvider"

export const ContextMenu = () => {
  const { openModal } = useModal()
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const { openTab } = useTabLayout()

  // Function to handle the click event on the hideMenu div
  const handleHideMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    setMenuAnchorEl(event.currentTarget)
    setCursorPosition({ x: event.clientX, y: event.clientY })
  }

  // Function to handle closing the menu
  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  // Effect to add a click listener to the document to close the menu when clicked outside
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (menuAnchorEl && !menuAnchorEl.contains(event.target as Node)) {
        handleMenuClose()
      }
    }

    document.addEventListener('click', handleDocumentClick)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [menuAnchorEl])

  return (
    <div
      className={styles.hideMenu}
      onContextMenu={handleHideMenuClick}
      style={{ cursor: 'pointer' }} // Add cursor style to indicate the clickable element
    >

      <Menu
        anchorReference="anchorPosition"
        anchorPosition={
          menuAnchorEl
            ? { top: cursorPosition.y, left: cursorPosition.x }
            : undefined
        }
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiMenu-list': {
            padding: 0,
          },
          '& .MuiMenu-paper': {
            background: '#2B2B30',
            width: '180px',
            shadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '5px',
          },
        }}
      >
        <div className={styles.hideMenuItem}>
          <Typography variant="body1">New Folder</Typography>
        </div>
        <Divider />
        <div
          className={styles.hideMenuItem}
          onClick={() => {
            console.log("NEW SPELL CLICKED")
            openModal({
              modal: 'createSpellModal',
            })
          }}
        >
          <Typography variant="body1">New Spell</Typography>
        </div>
        <Divider />
        <div className={styles.hideMenuItem}>
          <Typography variant="body1"> New Prompt</Typography>
        </div>
        <Divider />
        <div
          className={styles.hideMenuItem}
          onClick={() => {
            openTab({
              name: 'Documents',
              type: 'Documents',
              switchActive: true,
              id: 'Documents',
            })
          }}
        >
          <Typography variant="body1">New Document</Typography>
        </div>
      </Menu>
    </div>
  )
}