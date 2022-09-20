import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useModal } from '../../../contexts/ModalProvider'

export default function ActionModal({
  anchorEl,
  open,
  handleClose,
  handledelete,
  id,
  modal,
}) {
  const name = 'Edit'
  const handleDelete = () => {
    openModal({
      modal: 'deleteModal',
      content: 'This is an example modal',
      handledelete,
      id,
    })

    handleClose()
  }

  const handleEdit = () => {
    openModal({
      modal: `${modal}`,
      content: 'This is an example modal',
      name,
      id,
    })
    handleClose()
  }
  const { openModal } = useModal()
  return (
    <>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handleEdit()}>Edit</MenuItem>
        <MenuItem onClick={() => handleDelete()}>Delete</MenuItem>
      </Menu>
    </>
  )
}
