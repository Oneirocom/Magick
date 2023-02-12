// import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { Button } from '@nextui-org/react'
import useAuthentication from '../account/useAuthentication'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { mutate } from 'swr'
import { Button } from '@mui/material'

export default function DeleteFileButton({ id }: { id: string }) {
  const { headers } = useAuthentication()
  const [isDeleting, setIsDeleting] = useState(false)

  async function onClick() {
    try {
      setIsDeleting(true)
      if (window.confirm('Are you sure you want to delete this file?')) {
        await fetch(`https://api.openai.com/v1/files/${id}`, {
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
    <Button onClick={onClick} disabled={isDeleting}>
      Trash Icon Here
    </Button>
  )
}
