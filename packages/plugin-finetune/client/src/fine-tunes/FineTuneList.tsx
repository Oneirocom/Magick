import useAuthentication from '../account/useAuthentication'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useSWR, { mutate } from 'swr'
import { OpenAI } from '../types/openai'
import Button from '@mui/material/Button'
import { IconButton, Table, TableCell, TableRow } from '@mui/material'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import { OPENAI_ENDPOINT } from '@magickml/engine'
export default function FineTuneList() {
  const { data, error } = useSWR<OpenAI.List<OpenAI.FineTune>>('fine-tunes')

  if (error) return <ErrorMessage error={error} />
  if (!data) return <Loading />
  const fineTunes = data.data

  if (fineTunes.length === 0) {
    return (
      <div className="my-4">
        <b>No fine-tuned models</b>
      </div>
    )
  }

  return (
    <>
      <Processing fineTunes={fineTunes} />
      <FineTunesTable fineTunes={fineTunes} />
    </>
  )
}

function Processing({ fineTunes }: { fineTunes: OpenAI.FineTune[] }) {
  const processing = fineTunes.filter(
    fineTune => fineTune.status !== 'succeeded'
  )

  useEffect(
    function () {
      if (processing.length === 0) return

      const interval = setInterval(() => {
        mutate('fine-tunes')
      }, 1000)
      return () => clearInterval(interval)
    },
    [processing]
  )

  return (
    <ol className="m-0 list-none">
      {processing.map(fineTune => (
        <li key={fineTune.id}>
          Processing {fineTune.id} <CancelFineTune id={fineTune.id} />
        </li>
      ))}
    </ol>
  )
}

function FineTunesTable({ fineTunes }: { fineTunes: OpenAI.FineTune[] }) {
  const ready = fineTunes.filter(fineTune => fineTune.status === 'succeeded')
  return (
    <Table>
      {ready
        .sort((a, b) => b.updated_at - a.updated_at)
        .map((fineTune, index) => (
          <TableRow
            // className={index % 2 === 0 ? 'bg-gray-100' : ''}
            key={fineTune.id}
          >
            <TableCell className="p-2 max-w-0 truncate" title={fineTune.id}>
              <a href={`/fineTuneManager/fine-tune/${fineTune.id}`}>
                {fineTune.id}
              </a>
            </TableCell>
            <TableCell className="p-2 max-w-0 truncate">
              {[...fineTune.training_files, ...fineTune.validation_files]
                .map(({ filename }) => filename)
                .join(', ')}
            </TableCell>
            <TableCell
              className="p-2 max-w-0 truncate"
              title={new Date(fineTune.updated_at * 1000).toISOString()}
            >
              {new Date(fineTune.updated_at * 1000).toLocaleString()}
            </TableCell>
            <TableCell className="p-2 w-8">
              <DeleteFineTune id={fineTune.id} />
            </TableCell>
          </TableRow>
        ))}
    </Table>
  )
}

function CancelFineTune({ id }: { id: string }) {
  const { headers } = useAuthentication()
  const [isLoading, setIsLoading] = useState(false)

  async function onClick() {
    try {
      setIsLoading(true)
      await fetch(`${OPENAI_ENDPOINT}/fine-tunes/${id}/cancel`, {
        method: 'PSOT',
        headers,
      })
      await mutate('tune-tunes')
    } catch (error) {
      toast.error(String(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button disabled={isLoading} onClick={onClick}>
      Cancel
    </Button>
  )
}

function DeleteFineTune({ id }: { id: string }) {
  const { headers } = useAuthentication()
  const [isDeleting, setIsDeleting] = useState(false)

  async function onClick() {
    try {
      setIsDeleting(true)
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this model?')) {
        await fetch(`${OPENAI_ENDPOINT}/models/${id}`, {
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
