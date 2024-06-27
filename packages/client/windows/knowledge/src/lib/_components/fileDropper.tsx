import React, { useCallback, useState } from 'react'
import { useDropzone, Accept } from 'react-dropzone'

type FileDropperProps = {
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>
  accept?: Accept
  maxSize?: number
  maxFiles?: number
  className?: string
  dropzoneText?: string
  fileTypes?: string[]
  type?: string
}

const FileDropper: React.FC<FileDropperProps> = ({
  handleFileUpload,
  accept,
  maxSize,
  maxFiles = 1,
  className = '',
  dropzoneText = 'Click to upload or drag and drop',
  fileTypes = [
    '.eml',
    '.html',
    '.json',
    '.md',
    '.msg',
    '.rst',
    '.rtf',
    '.txt',
    '.xml',
    '.jpeg',
    '.jpg',
    '.png',
    '.csv',
    '.doc',
    '.docx',
    '.epub',
    '.odt',
    '.pdf',
    '.ppt',
    '.pptx',
    '.tsv',
    '.xlsx',
  ],
  type,
}) => {
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'loading' | 'loaded'
  >('idle')

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploadStatus('loading')
      // Create a synthetic event
      const syntheticEvent = {
        target: {
          files: acceptedFiles,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>

      try {
        await handleFileUpload(syntheticEvent)
        setUploadStatus('loaded')
      } catch (error) {
        console.error('File upload failed:', error)
        setUploadStatus('idle')
      }
    },
    [handleFileUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || { [type || fileTypes.join(',')]: [] },
    maxSize,
    maxFiles,
  })

  const getUploadStatusText = () => {
    switch (uploadStatus) {
      case 'loading':
        return 'Uploading...'
      case 'loaded':
        return 'File uploaded successfully!'
      default:
        return isDragActive ? 'Release to drop the files here' : dropzoneText
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center w-full ${className}`}
    >
      <p className="text-sm mb-5">
        Please be aware that larger documents may take some time to process and
        may appear to fail. We are working on a queue system to improve this.
      </p>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-64 bg-white border-2 rounded-lg cursor-pointer border-secondary-da hover:border-secondary-highlight dark:bg-card-main text-center px-8 ${className} ${
          uploadStatus === 'loading' ? 'opacity-50' : ''
        }`}
      >
        <input {...getInputProps()} disabled={uploadStatus === 'loading'} />
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {uploadStatus === 'loading' ? (
            <svg
              className="animate-spin h-10 w-10 text-secondary-highlight"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              className="w-10 h-10 mb-3 text-secondary-highlight"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
          )}
          <p className="mb-2 text-sm text-black dark:text-white">
            {getUploadStatusText()}
          </p>
          {uploadStatus === 'idle' && (
            <p className="text-xs text-secondary-highlight">
              {type ? type : fileTypes.join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileDropper
