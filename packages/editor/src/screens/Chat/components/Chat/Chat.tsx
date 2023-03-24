import { Conversation, KeyValuePair, Message, OpenAIModel } from "../../../../types";
import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { ModelSelect } from "./ModelSelect";
import { Regenerate } from "./Regenerate";
import { SystemPrompt } from "./SystemPrompt";
import { Spell } from '@magickml/engine'
import chatStyles from './styles.module.css';

type Spells = {
  data: Spell[];
  total: number;
  limit: number;
  skip: number;
};

interface Props {
  conversation: Conversation;
  models: OpenAIModel[];
  spells: Spells;
  messageIsStreaming: boolean;
  modelError: boolean;
  messageError: boolean;
  loading: boolean;
  onSend: (message: Message, isResend: boolean) => void;
  onUpdateConversation: (conversation: Conversation, data: KeyValuePair) => void;
  stopConversationRef: MutableRefObject<boolean>;
}

export const Chat: FC<Props> = ({ conversation, models, spells, messageIsStreaming, modelError, messageError, loading, onSend, onUpdateConversation, stopConversationRef }) => {
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
      {spells?.data?.length === 0 ? (
        <div className={chatStyles.flexCenter}>
          <div className={chatStyles.textTitle}>Spell Required</div>
          <div className={chatStyles.textSubTitle}>Please create a spell.</div>
        </div>
      ) : modelError ? (
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
                <div className={chatStyles.initialTitle}>{models.length === 0 ? "Loading..." : "Chatbot UI"}</div>

                {models.length > 0 && (
                  <div className={chatStyles.modelOptions}>
                    {/* TODO: Change model for SpellSelect */}
                    <ModelSelect
                      model={conversation.model}
                      models={models}
                      onModelChange={(model) => onUpdateConversation(conversation, { key: "model", value: model })}
                    />

                    <SystemPrompt
                      conversation={conversation}
                      onChangePrompt={(prompt) => onUpdateConversation(conversation, { key: "prompt", value: prompt })}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className={chatStyles.modelName}>Model: {conversation.model.name}</div>

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
              model={conversation.model}
            />
          )}
        </>
      )}
    </div>
  );
};
