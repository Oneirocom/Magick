// DOCUMENTED
/**
 * GetRecordsButton component provides a button to get the record from the documents DB, these will be convereted
 * to JSONL format and used to fine tune the model.
 * @param enforce - type of enforcement selected to upload the file
 * @param purpose - purpose of the OpenAI request
 * @returns React Component
 */
import React, { useRef } from 'react'
import { OpenAI } from '../types/openai'
import { Enforce, MimeTypes } from './useUploadFile'
import Button from '@mui/material/Button'
import { DEFAULT_PROJECT_ID, API_ROOT_URL } from '@magickml/config'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import axios from 'axios'
import { extractPromptsAndCompletions } from '../documents/documentLoader'
import useDocument from '../documents/useDocument'
import useAuthentication from '../account/useAuthentication'
import { useSelector } from 'react-redux'

interface Props {
  enforce: Enforce
  purpose: OpenAI.Purpose
}

export default function GetRecordsButton({ enforce, purpose }: Props) {
  // TODO: I don't think this is used
  const { headers } = useAuthentication()
  console.log(headers)

  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token

  const inputRef = useRef<HTMLInputElement>(null)
  //const { isLoading, uploadFile } = useUploadFile(purpose, enforce);
  const { documentLoad } = useDocument(purpose, enforce)
  /**
   * Calls the upload function when the user selects a file
   */
  async function onChange() {}

  async function get_record(): Promise<void> {
    const projectId = DEFAULT_PROJECT_ID
    const url = `${API_ROOT_URL}/documents/`
    const params = new URLSearchParams([['projectId', projectId]])
    const result = await (
      await axios.get(url, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data.data
    let text = ''
    result.slice(0, 1).forEach(async record => {
      text += record.content
    })
    console.log(text)
    const data = await extractPromptsAndCompletions(text)
    const r = await documentLoad(data)
    console.log(r)
  }

  return (
    <span>
      <input
        accept={MimeTypes.join()}
        onChange={onChange}
        ref={inputRef}
        style={{ display: 'none' }}
        type="file"
      />
      <Button
        variant="contained"
        disabled={false}
        style={{ backgroundColor: 'purple', color: 'white' }}
        onClick={async () => await get_record()}
        startIcon={<UploadFileIcon />}
      >
        Get Records
      </Button>
    </span>
  )
}

/******/
/**
 * useOnDrop is a custom hook that adds event listeners to the page to detect dropped files and then calls the provided
 * callback function for that file
 */
