import React from 'react'

import Icon from '../../../components/Icon/Icon'

const VideoInput = ({ loadFile }) => {
  const hiddenFileInput = React.useRef(null)

  const handleClick = () => {
    hiddenFileInput.current.click()
  }

  const handleChange = event => {
    const fileUploaded = event.target.files[0]
    loadFile(fileUploaded)
  }
  return (
    <>
      <button onClick={handleClick}>
        <Icon name="folder" style={{ marginRight: 'var(--extraSmall)' }} />
        Import...
      </button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
        accept="video/mp4,video/x-m4v,video/m3u8,video/*"
      />
    </>
  )
}

export default VideoInput
