// DOCUMENTED
import React, { useRef, ChangeEvent } from 'react'
import { Button } from '../Button'

interface FileInputProps {
  /**
   * Function to process loaded files.
   */
  loadFile: (file: File) => void

  /**
   * Optional custom styles.
   */
  sx?: React.CSSProperties

  /**
   * Button text. Defaults to 'Import'.
   */
  innerText?: string

  /**
   * Optional custom icon for the button.
   */
  Icon?: React.ReactNode
}

/**
 * FileInput component.
 * Handles importing files from the user's device.
 */
const FileInput: React.FC<FileInputProps> = ({
  loadFile,
  sx,
  innerText = 'Import',
  Icon = <></>,
}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  /**
   * Handle button click by trigerring the hidden file input.
   */
  const handleClick = (): void => {
    hiddenFileInput.current?.click()
  }

  /**
   * Handle file input change by processing selected files.
   * @param event - Change event containing selected files.
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      Array.from(event.target.files).forEach(loadFile)
    }
  }

  return (
    <>
      <Button onClick={handleClick} style={{ ...sx }}>
        {Icon}
        {innerText}
      </Button>
      <input
        id="import"
        type="file"
        multiple
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </>
  )
}

export default FileInput
