// DOCUMENTED
/**
 * A React component that allows the user to import a video file.
 */
import React from 'react'
import { Icon } from 'client/core'

interface Props {
  /**
   * A callback function that will be called once a file has been loaded.
   * @param file - The file that has been loaded.
   */
  loadFile: (file: File) => void
}

const VideoInput: React.FC<Props> = ({ loadFile }) => {
  const hiddenFileInputRef = React.useRef<HTMLInputElement>(null)

  const handleClick = (): void => {
    hiddenFileInputRef.current?.click()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const fileUploaded = event.target.files![0] // ! operator because TS does not recognise if check.
    loadFile(fileUploaded)
  }

  return (
    <>
      <button onClick={handleClick}>
        <Icon name="folder" style={{ marginRight: 'var(--extraSmall)' }} />
        Import
      </button>
      <input
        type="file"
        ref={hiddenFileInputRef}
        onChange={handleChange}
        style={{ display: 'none' }}
        accept="video/mp4,video/x-m4v,video/m3u8,video/*"
      />
    </>
  )
}

export default VideoInput
