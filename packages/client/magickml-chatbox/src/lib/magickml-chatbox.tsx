import { useFeatureFlagEnabled } from 'posthog-js/react'
import styles from './magickml-chatbox.module.css'
import { Widget } from 'react-chat-widget'
// import 'react-chat-widget/lib/styles.css'

/* eslint-disable-next-line */
export interface MagickmlChatboxProps {}

export function MagickmlChatbox(props: MagickmlChatboxProps) {
  const showChatBoxFlag = useFeatureFlagEnabled('chat-exp-chatbox')

  const handleNewUserMessage = newMessage => {
    // Now send the message throught the backend API
    console.log(`New message incoming! ${newMessage}`)
  }

  return (
    <div className={styles['container']}>
      {showChatBoxFlag ? (
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          // profileAvatar={logo}
          title="Magick Bot"
          subtitle="Welcome to Magick!"
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default MagickmlChatbox
