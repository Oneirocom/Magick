import { FC, KeyboardEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import { Button } from '@magickml/client-core'
import styles from './styles.module.css';
import magickCSS from '../../../Magick/magick.module.css'

import { Spell } from '@magickml/core'
import { Message } from "../../../../types";
interface Props {
  messageIsStreaming: boolean;
  onSend: (message: Message) => void;
  spell: Spell;
  stopConversationRef: MutableRefObject<boolean>;
}

export const ChatInput: FC<Props> = ({ onSend, messageIsStreaming, spell, stopConversationRef }) => {
  const [content, setContent] = useState<string>();
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // TODO: Define max length
    const maxLength = 24000; // spell.id === OpenAIModelID.GPT_3_5 ? 12000 : 24000;

    if (value.length > maxLength) {
      alert(`Message limit is ${maxLength} characters`);
      return;
    }

    setContent(value);
  };

  const handleSend = () => {
    if (messageIsStreaming) {
      return;
    }

    if (!content) {
      alert("Please enter a message");
      return;
    }

    onSend({ role: "user", content });
    setContent("");

    if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const isMobile = () => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isTyping) {
      if (e.key === "Enter" && !e.shiftKey && !isMobile()) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
      textareaRef.current.style.overflow = `${textareaRef?.current?.scrollHeight > 400 ? "auto" : "hidden"}`;
    }
  }, [content]);

  // function handleStopConversation() {
  //   stopConversationRef.current = true;
  //   setTimeout(() => {
  //     stopConversationRef.current = false;
  //   }, 1000);
  // }

  return (
    <div className={styles.container}>

      {/* FIXME: Stop spell and reset to last message state */}
      {/* {messageIsStreaming && (
        <Button
          className="small"
          style={{ cursor: 'pointer' }}
          onClick={handleStopConversation}
        >
          <StopCircle
            className={styles.stopCircleIcon}
          />
          {" "}
          Stop Generating

        </Button>
      )} */}

      <div className={styles.innerContainer}>

        <div className={magickCSS['playtest-input']}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            style={{
              resize: "none",
              bottom: `${textareaRef?.current?.scrollHeight}px`,
              maxHeight: "400px",
              overflow: `${textareaRef.current && textareaRef.current.scrollHeight > 400 ? "auto" : "hidden"}`
            }}
            placeholder="Type a message..."
            value={content}
            rows={1}
            onCompositionStart={() => setIsTyping(true)}
            onCompositionEnd={() => setIsTyping(false)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <Button
            className="small"
            style={{ cursor: 'pointer' }}
            onClick={handleSend}
          >
            Send
          </Button>
        </div>


      </div>
    </div>
  );
};
