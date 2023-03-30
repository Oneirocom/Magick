// GENERATED 
/**
 * A component to display a message in a window.
 * @param {string} content - The message to display.
 * @returns {JSX.Element} A JSX element displaying the message.
 */
const WindowMessage = ({ content = 'No component selected' }: { content?: string }): JSX.Element => {
  return (
    <p className={css.message}>{content}</p>
  );
}

export default WindowMessage;