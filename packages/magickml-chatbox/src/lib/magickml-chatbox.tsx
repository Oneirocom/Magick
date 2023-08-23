import { useFeatureFlagEnabled } from 'posthog-js/react'
import styles from './magickml-chatbox.module.css'
import { Widget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import chatbot from '../assets/chatbot.png'
import defaultAvatar from '../assets/defaultAvatar.jpg'

/* eslint-disable-next-line */
export interface MagickmlChatboxProps {}

export function MagickmlChatbox(props: MagickmlChatboxProps) {

  const showChatBoxFlag = useFeatureFlagEnabled('chat-exp-chatbox')

  const handleNewUserMessage = (newMessage) => {
    // Now send the message throught the backend API
    console.log(`New message incoming! ${newMessage}`);
  };    

  return (
    <div className={styles['container']}>
      {
        showChatBoxFlag ? (
          <Widget
            handleNewUserMessage={handleNewUserMessage}
            titleAvatar={defaultAvatar}
            autofocus={true}
            title="Magick Bot"
            emojis="true"
            subtitle="Welcome to Magick!"
            showCloseButton={true}
            launcherOpenImg={chatbot}
            launcherCloseImg={chatbot}
          />
        ) : ''
      }
    </div>
  )
}

export default MagickmlChatbox
