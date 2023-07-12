import styles from './magickml-chatbox.module.css'

/* eslint-disable-next-line */
export interface MagickmlChatboxProps {}

export function MagickmlChatbox(props: MagickmlChatboxProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to MagickmlChatbox!</h1>
    </div>
  )
}

export default MagickmlChatbox
