import { useLayout } from '../../contexts/LayoutProvider'

const WysiwygControl = () => {
  const { createOrFocus, windowTypes } = useLayout()

  const onClick = () => {
    createOrFocus(windowTypes.WYSIWYG_EDITOR, 'Wysiwyg Editor')
  }

  return <button onClick={onClick}>Edit wysiwyg in editor</button>
}

export default WysiwygControl
