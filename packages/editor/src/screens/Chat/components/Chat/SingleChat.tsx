import { Conversation, KeyValuePair, Message } from "../../../../types";
import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { SpellSelect } from "./SpellSelect";
import { Regenerate } from "./Regenerate";
import chatStyles from './styles.module.css';
import { SpellInterface } from '@magickml/core'

interface Props {
  conversation: Conversation;
  spells: SpellInterface[];
  messageIsStreaming: boolean;
  chatError: boolean;
  messageError: boolean;
  loading: boolean;
  onSend: (message: Message, isResend: boolean) => void;
  onUpdateConversation: (conversation: Conversation, data: KeyValuePair) => void;
  stopConversationRef: MutableRefObject<boolean>;
}

export const SingleChat: FC<Props> = ({ conversation, spells, messageIsStreaming, chatError, messageError, loading, onSend, onUpdateConversation, stopConversationRef }) => {
  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const bottomTolerance = 30;

      if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
        setAutoScrollEnabled(false);
      } else {
        setAutoScrollEnabled(true);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);

      return () => {
        chatContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <div className={chatStyles.container}>
      {spells?.length === 0 ? (
        <div className={chatStyles.flexCenter}>
          <div className={chatStyles.textTitle}>Spell Required</div>
          <div className={chatStyles.textSubTitle}>Please create a spell.</div>
        </div>
      ) : chatError ? (
        <div className={chatStyles.flexCenter}>
          <div className={chatStyles.textError}>Error fetching models.</div>
          <div className={chatStyles.textError}>Make sure your OpenAI API key is set in the bottom left of the sidebar or in a .env.local file and refresh.</div>
          <div className={chatStyles.textError}>If you completed this step, OpenAI may be experiencing issues.</div>
        </div>
      ) : (
        <>
          <div
            className={chatStyles.overflowScroll}
            ref={chatContainerRef}
          >
            {conversation.messages.length === 0 ? (
              <div className={chatStyles.initialContent}>
                <div className={chatStyles.initialTitle}>{spells?.length === 0 ? "Loading..." : ""}</div>

                {spells?.length > 0 && (
                  <div className={chatStyles.spellOptions}>
                    <SpellSelect
                      spell={conversation.spell}
                      spells={spells}
                      onSpellChange={(spell) => onUpdateConversation(conversation, { key: "spell", value: spell })}
                    />

                    {/* <SystemPrompt
                      conversation={conversation}
                      onChangePrompt={(prompt) => onUpdateConversation(conversation, { key: "prompt", value: prompt })}
                    /> */}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className={chatStyles.spellName}>Spell: {conversation?.spell?.name ?? "Chat"}</div>

                {conversation.messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message}
                  />
                ))}

                {loading && <ChatLoader />}

                <div
                  className={chatStyles.bottomSpace}
                  ref={messagesEndRef}
                />
              </>
            )}
          </div>

          {messageError ? (
            <Regenerate
              onRegenerate={() => {
                if (currentMessage) {
                  onSend(currentMessage, true);
                }
              }}
            />
          ) : (
            <ChatInput
              stopConversationRef={stopConversationRef}
              messageIsStreaming={messageIsStreaming}
              onSend={(message) => {
                setCurrentMessage(message);
                onSend(message, false);
              }}
              spell={conversation.spell}
            />
          )}
        </>
      )}
    </div>
  );
};
