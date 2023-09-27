// DOCUMENTED
import { Button } from '@magickml/client-core'
import React from 'react'

/**
 * A component that allows the user to import files by clicking a button
 * @param {object} props - Component props
 * @param {function} props.loadFile - Function to load the selected file
 * @param {object} props.sx - Additional styling for the button element
 * @param {string} props.innerText - Text for the button
 * @param {React.ReactNode} props.Icon - A React Node for an icon
 */
const FileInput = ({
  loadFile,
  sx = {},
  innerText = 'Import',
  Icon = <> </>,
}) => {
  const hiddenFileInput = React.useRef(null)

  const handleClick = () => {
    hiddenFileInput.current.click()
  }

  const handleChange = event => {
    Object.values(event.target.files).forEach(loadFile)
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
        accept="application/JSON"
        style={{ display: 'none' }}
      />
    </>
  )
}

export default FileInput
