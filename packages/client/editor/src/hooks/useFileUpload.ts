import { useState } from 'react'

type InitialState = {
  tag: string
  name: string
  sourceUrl: string
  dataType: string
  files: File[]
}

const useFileUpload = ({ initialState }: { initialState?: InitialState }) => {
  const [loading, setLoading] = useState(false)
  const [newKnowledge, setKnowledge] = useState(
    initialState || {
      tag: '',
      name: '',
      sourceUrl: '',
      dataType: '',
      files: [],
    }
  )

  const handleDataTypesChange = (event: any) => {
    setKnowledge({ ...newKnowledge, dataType: event.target.value })
  }

  const handleFileUpload = async (files: File[], type?: string) => {
    const file = files.length > 0 ? files[0] : null
    if (!file) return

    setLoading(true)
    setKnowledge({ ...newKnowledge, files: [file], name: file.name })
    setLoading(false)
  }

  const triggerFileUpload = (accept: string) => {
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.multiple = false
    inputElement.accept = accept
    inputElement.click()
    inputElement.addEventListener('change', async event => {
      const files = (event.target as HTMLInputElement).files
      if (files) {
        await handleFileUpload(Array.from(files))
      }
    })
  }

  return {
    loading,
    newKnowledge,
    setKnowledge,
    handleDataTypesChange,
    handleFileUpload,
    triggerFileUpload,
  }
}

export default useFileUpload
