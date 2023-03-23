import { Button } from '@magickml/client-core'
import React from 'react'

const FileInput = ({ loadFile, sx, innerText = 'Import', Icon = <> </> }) => {
  const hiddenFileInput = React.useRef(null)

  const handleClick = () => {
    hiddenFileInput.current.click()
  }

  const handleChange = event => {
    Object.values(event.target.files).forEach(loadFile)
  }
  return (
    <>
      <Button onClick={handleClick} style={{...sx}}>
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
