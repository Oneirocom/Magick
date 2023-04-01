// DOCUMENTED 
/** 
 * An icon button component that deletes a file when clicked.
 * @param {string} id - The id of the file to be deleted.
 * @return {JSX.Element} Delete icon button. 
 */
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import useAuthentication from '../account/useAuthentication';

import { OPENAI_ENDPOINT } from '../constants';

export default function DeleteFileButton({ id }: { id: string }): JSX.Element {
  const { headers } = useAuthentication();
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Handles the delete button onClick event.
   * @throws Toasts any errors during the file delete fetch request.
   */
  async function onClick(): Promise<void> {
    try {
      setIsDeleting(true);
      if (confirm('Are you sure you want to delete this file?')) {
        await fetch(`${OPENAI_ENDPOINT}/files/${id}`, {
          method: 'DELETE',
          headers,
        });
        await mutate('files');
      }
    } catch (error) {
      toast.error(String(error));
      setIsDeleting(false);
    }
  }

  return (
    <IconButton onClick={onClick} disabled={isDeleting}>
      <DeleteOutlined fontSize="medium" />
    </IconButton>
  );
}