import { Button } from '@magickml/client-core'
import React from 'react'

import { Icon } from '@magickml/client-core'

const FileInput = ({ loadFile }) => {
  const hiddenFileInput = React.useRef(null)

  const handleClick = () => {
    hiddenFileInput.current.click()
  }

  const handleChange = event => {
    Object.values(event.target.files).forEach(loadFile)
  }
  return (
    <>
      <Button onClick={handleClick}>
        <Icon
          name="folder"
          size={16}
          style={{ marginRight: 'var(--extraSmall)' }}
        />
        Import...
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
