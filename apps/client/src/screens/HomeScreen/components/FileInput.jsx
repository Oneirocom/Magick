import React from 'react'
import { VscDebugBreakpointConditionalUnverified } from 'react-icons/vsc'

import Icon from '../../../components/Icon/Icon'

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
      <button onClick={handleClick}>
        <Icon name="folder" style={{ marginRight: 'var(--extraSmall)' }} />
        Import...
      </button>
      <input
        type="file"
        multiple="multiple"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </>
  )
}

export default FileInput
