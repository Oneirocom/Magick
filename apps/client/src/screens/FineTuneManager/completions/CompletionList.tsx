import FileListTable from '../files/FileListTable'
import UploadFileButton from '../files/UploadFileButton'
import FineTuneList from '../fine-tunes/FineTuneList'
import UsageInstructions from '../instructions/UsageInstructions'
import React from 'react'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as CompletionInstructions } from './instructions.md'

export default function ClassificationList() {
  const navigate = useNavigate()
  return (
    <main className="mx-auto space-y-12 max-w-4xl">
      <section className="space-y-4">
        <div className="flex flex-nowrap justify-between items-center">
          <h1 className="text-3xl">Completions</h1>
          <Button
            size="small"
            onClick={() => navigate('/fineTuneManager/fine-tunes/new')}
          >
            New Model
          </Button>
        </div>
        <FineTuneList />
      </section>
      <section className="space-y-4">
        <div className="flex flex-nowrap justify-between items-center">
          <h2 className="text-3xl">Training Files</h2>
          <UploadFileButton
            purpose="fine-tune"
            enforce={{
              required: ['prompt', 'completion'],
              count: ['prompt', 'completion'],
              maxTokens: 2048,
            }}
          />
        </div>
        <FileListTable purpose="fine-tune" />
      </section>
      <UsageInstructions>
        <CompletionInstructions></CompletionInstructions>
      </UsageInstructions>
    </main>
  )
}
