import { useLayout } from '../../contexts/LayoutProvider'

const CodeControl = () => {
  const { createOrFocus, windowTypes } = useLayout()

  const onClick = () => {
    createOrFocus(windowTypes.TEXT_EDITOR, 'Text Editor')
  }

  return <button onClick={onClick}></button>
}

export default CodeControl
