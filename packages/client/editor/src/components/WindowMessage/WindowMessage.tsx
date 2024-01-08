// DOCUMENTED
import css from './windowMessage.module.css'

/**
 * WindowMessage component that displays a message with default or provided content.
 * @param {Object} props - The properties for the WindowMessage component.
 * @param {string} [props.content='No component selected'] - The content of the message to display.
 * @returns {React.JSX.Element} - The rendered component.
 */
const WindowMessage = ({ content = 'No component selected' }): React.JSX.Element => {
  // Return a paragraph element with the provided or default content
  return (<div className={css['container']}>
    <div className={css['message']}>{content}</div>
  </div>)
}

export default WindowMessage
