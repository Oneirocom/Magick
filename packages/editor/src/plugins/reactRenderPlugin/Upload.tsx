// DOCUMENTED

import { API_ROOT_URL, DEFAULT_USER_TOKEN, PRODUCTION } from '@magickml/core'
import { useState } from 'react'
import { useSelector } from 'react-redux'

/**
 * Converts a file object to a base64-encoded data URI
 * @param file - The file to be converted
 * @returns A promise that resolves to the data URI
 */
const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = event => {
      resolve(event.target.result as string)
    }
    reader.readAsDataURL(file)
  })
}

interface UploadProps {
  id_image: string
  output: string
}

interface UploadState {
  file: string | null
  output: string
  dataURI: string | null
}

/**
 * Upload component that allows users to select, preview, and upload an image file
 */
export const Upload = ({ id_image, output }: UploadProps) => {
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token

  const [state, setState] = useState<UploadState>({
    file: null,
    output,
    dataURI: null,
  })

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    // Set preview image
    setState(prevState => ({
      ...prevState,
      file: URL.createObjectURL(event.target.files[0]),
    }))

    // Convert file to data URI and upload to server
    try {
      const dataUri = await fileToDataUri(file)

      await fetch(`${API_ROOT_URL}/upload`, {
        method: 'POST',
        headers: PRODUCTION
          ? { Authorization: `Bearer ${token}` }
          : { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` },
        body: JSON.stringify({ id: id_image, uri: dataUri }),
      })
    } catch (error) {
      console.log(`Error uploading file: ${error}`)
    }
  }

  return (
    <div style={{ height: '200px' }}>
      <input type="file" onChange={handleChange} />
      <img
        src={state.file}
        style={{ width: '100%', maxHeight: '100%' }}
        alt="Preview"
      />
    </div>
  )
}

// Note: Use an arrow function instead of a class component to simplify and optimize the code.
