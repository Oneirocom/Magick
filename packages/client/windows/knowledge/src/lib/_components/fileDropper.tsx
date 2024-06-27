import React, { useCallback } from 'react'
import { useDropzone, Accept } from 'react-dropzone'

type FileDropperProps = {
  handleFileUpload: (files: File[], type?: string) => void
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
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleFileUpload(acceptedFiles, type)
    },
    [handleFileUpload, type]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || { [type || fileTypes.join(',')]: [] },
    maxSize,
    maxFiles,
  })

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
        className={`flex flex-col items-center justify-center w-full h-64 bg-white border-2 rounded-lg cursor-pointer border-secondary-da hover:border-secondary-highlight dark:bg-card-main text-center px-8 ${className}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
          <p className="mb-2 text-sm text-black dark:text-white">
            {isDragActive ? (
              <span>Release to drop the files here</span>
            ) : (
              <>
                <span className="font-semibold">{dropzoneText}</span>
              </>
            )}
          </p>
          <p className="text-xs text-secondary-highlight">
            {fileTypes.join(', ')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default FileDropper
