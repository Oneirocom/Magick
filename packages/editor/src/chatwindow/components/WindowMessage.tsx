import css from './windowMessage.module.css'

const WindowMessage = ({ content = 'No component selected' }) => {
  return <p className={css['message']}>{content}</p>
}

export default WindowMessage
