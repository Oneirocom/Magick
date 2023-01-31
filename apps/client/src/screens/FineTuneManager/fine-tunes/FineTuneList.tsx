import useAuthentication from '../account/useAuthentication'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useSWR, { mutate } from 'swr'
import type { OpenAI } from '../../../../../../@types/openai'
import Button from '@mui/material/Button'

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
    <table className="my-4 w-full border-collapse">
      <tbody>
        {ready
          .sort((a, b) => b.updated_at - a.updated_at)
          .map((fineTune, index) => (
            <tr
              className={index % 2 === 0 ? 'bg-gray-100' : ''}
              key={fineTune.id}
            >
              <td className="p-2 max-w-0 truncate" title={fineTune.id}>
                <a href={`/fine-tunes/${fineTune.id}`}>{fineTune.id}</a>
              </td>
              <td className="p-2 max-w-0 truncate">
                {[...fineTune.training_files, ...fineTune.validation_files]
                  .map(({ filename }) => filename)
                  .join(', ')}
              </td>
              <td
                className="p-2 max-w-0 truncate"
                title={new Date(fineTune.updated_at * 1000).toISOString()}
              >
                {new Date(fineTune.updated_at * 1000).toLocaleString()}
              </td>
              <td className="p-2 w-8">
                <DeleteFineTune id={fineTune.id} />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}

function CancelFineTune({ id }: { id: string }) {
  const { headers } = useAuthentication()
  const [isLoading, setIsLoading] = useState(false)

  async function onClick() {
    try {
      setIsLoading(true)
      await fetch(`https://api.openai.com/v1/fine-tunes/${id}/cancel`, {
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
      if (window.confirm('Are you sure you want to delete this model?')) {
        await fetch(`https://api.openai.com/v1/models/${id}`, {
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
