import Button from 'packages/editor/src/components/Button'
import { useLayout } from '../../contexts/LayoutProvider'

const LongText = () => {
  const { createOrFocus, windowTypes } = useLayout()

  const onClick = () => {
    createOrFocus(windowTypes.TEXT_EDITOR, 'Text Editor')
  }

  return <Button onClick={onClick}>Open in text editor</Button>
}

export default LongText
