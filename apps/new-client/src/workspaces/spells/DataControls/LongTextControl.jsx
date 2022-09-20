import { useLayout } from '../../contexts/LayoutProvider'

const LongText = () => {
  const { createOrFocus, windowTypes } = useLayout()

  const onClick = () => {
    createOrFocus(windowTypes.TEXT_EDITOR, 'Text Editor')
  }

  return <button onClick={onClick}>Open in text editor</button>
}

export default LongText
