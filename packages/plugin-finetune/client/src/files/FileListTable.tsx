import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
// import Link from 'next/link'
import React from 'react'
import useSWR from 'swr'
import { OpenAI } from '../types/openai'
import DeleteFileButton from './DeleteFileButton'
import { Table, TableCell } from '@mui/material'

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
    <Table>
      {files
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((file, index) => (
          <tr className={index % 2 === 0 ? 'bg-gray-100' : ''} key={file.id}>
            <TableCell className="p-2 max-w-0 truncate" title={file.id}>
              {linkTo ? (
                <a href={linkTo(file)}>
                  <a>{file.id}</a>
                </a>
              ) : (
                file.id
              )}
            </TableCell>
            <TableCell className="p-2 max-w-0 truncate" title={file.filename}>
              {file.filename}
            </TableCell>
            <TableCell
              className="p-2 max-w-0 truncate"
              title={new Date(file.createdAt * 1000).toISOString()}
            >
              {new Date(file.createdAt * 1000).toLocaleString()}
            </TableCell>
            <TableCell className="p-2 w-8">
              <DeleteFileButton id={file.id} />
            </TableCell>
          </tr>
        ))}
    </Table>
  )
}
