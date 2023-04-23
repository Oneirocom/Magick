// DOCUMENTED
/**
 * An icon button component that deletes a dataset when clicked.
 * @param {string} id - The id of the file to be deleted.
 * @return {JSX.Element} Delete icon button.
 */
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import { IconButton } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { mutate } from 'swr'
import useAuthentication from '../account/useAuthentication'

import { API_ROOT_URL } from '@magickml/core'

export default function DeleteDatasetButton({
  id,
}: {
  id: number
}): JSX.Element {
  const { headers } = useAuthentication()
  const [isDeleting, setIsDeleting] = useState(false)

  /**
   * Handles the delete button onClick event.
   * @throws Toasts any errors during the file delete fetch request.
   */
  async function onClick(): Promise<void> {
    try {
      setIsDeleting(true)
      if (window?.confirm('Are you sure you want to delete this dataset?')) {
        await fetch(`${API_ROOT_URL}/datasets/${id}`, {
          method: 'DELETE',
          headers,
        })
        await mutate('datasets')
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
