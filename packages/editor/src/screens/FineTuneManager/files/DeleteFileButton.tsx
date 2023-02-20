// import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { Button } from '@nextui-org/react'
import useAuthentication from '../account/useAuthentication'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { mutate } from 'swr'
import { IconButton } from '@mui/material'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import { OPENAI_ENDPOINT } from '@magickml/engine'

export default function DeleteFileButton({ id }: { id: string }) {
  const { headers } = useAuthentication()
  const [isDeleting, setIsDeleting] = useState(false)

  async function onClick() {
    try {
      setIsDeleting(true)
      if (window.confirm('Are you sure you want to delete this file?')) {
        await fetch(`${OPENAI_ENDPOINT}/files/${id}`, {
          method: 'DELETE',
          headers,
        })
        await mutate('files')
      }
    } catch (error) {
      toast.error(String(error))
      setIsDeleting(false)
    }
  }

  return (
    <IconButton onClick={onClick} disabled={isDeleting}>
      <DeleteOutlined fontSize="medium" />
    </IconButton>
  )
}
