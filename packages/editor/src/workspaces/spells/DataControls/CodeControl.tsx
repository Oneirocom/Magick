import Button from 'packages/editor/src/components/Button'
import { useLayout } from '../../contexts/LayoutProvider'

const CodeControl = () => {
  const { createOrFocus, windowTypes } = useLayout()

  const onClick = () => {
    createOrFocus(windowTypes.TEXT_EDITOR, 'Text Editor')
  }

  return <Button onClick={onClick}></Button>
}

export default CodeControl
