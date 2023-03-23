import { Button } from '@magickml/client-core'
import { useLayout } from '../contexts/LayoutProvider'

const CodeControl = () => {
  const { createOrFocus, windowTypes } = useLayout()

  const onClick = () => {
    createOrFocus(windowTypes.TEXT_EDITOR, 'Text Editor')
  }

  return <Button onClick={onClick}>Open in code editor</Button>
}

export default CodeControl
