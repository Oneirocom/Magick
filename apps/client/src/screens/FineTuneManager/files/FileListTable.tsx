import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
// import Link from 'next/link'
import React from 'react'
import useSWR from 'swr'
import type { OpenAI } from '../../../../../../@types/openai'
import DeleteFileButton from './DeleteFileButton'

export default function FileListTable({
  linkTo,
  purpose,
}: {
  linkTo?: (file: OpenAI.File) => string
  purpose: OpenAI.Purpose
}) {
  const { data, error } = useSWR<OpenAI.List<OpenAI.File>>('files')

  if (error) return <ErrorMessage error={error} />
  if (!data) return <Loading />
  const files = data.data.filter(file => file.purpose === purpose)
  if (files.length === 0) {
    return (
      <div className="my-4">
        <b>No files uploaded</b>
      </div>
    )
  }

  return (
    <table className="w-full border-collapse">
      <tbody>
        {files
          .sort((a, b) => b.created_at - a.created_at)
          .map((file, index) => (
            <tr className={index % 2 === 0 ? 'bg-gray-100' : ''} key={file.id}>
              <td className="p-2 max-w-0 truncate" title={file.id}>
                {linkTo ? (
                  <a href={linkTo(file)}>
                    <a>{file.id}</a>
                  </a>
                ) : (
                  file.id
                )}
              </td>
              <td className="p-2 max-w-0 truncate" title={file.filename}>
                {file.filename}
              </td>
              <td
                className="p-2 max-w-0 truncate"
                title={new Date(file.created_at * 1000).toISOString()}
              >
                {new Date(file.created_at * 1000).toLocaleString()}
              </td>
              <td className="p-2 w-8">
                <DeleteFileButton id={file.id} />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
