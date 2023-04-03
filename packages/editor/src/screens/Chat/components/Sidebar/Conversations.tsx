import { Conversation } from "../../../../types";
import { Check, Message, Edit, DeleteOutline, Close } from '@mui/icons-material'

import { FC, KeyboardEvent, useEffect, useState } from "react";
import styles from './styles.module.css';

interface Props {
  loading: boolean;
  conversations: Conversation[];
  selectedConversation: Conversation;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversation: Conversation) => void;
  onRenameConversation: (conversation: Conversation, name: string) => void;
}

export const Conversations: FC<Props> = ({ loading, conversations, selectedConversation, onSelectConversation, onDeleteConversation, onRenameConversation }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRename(selectedConversation);
    }
  };

  const handleRename = (conversation: Conversation) => {
    onRenameConversation(conversation, renameValue);
    setRenameValue("");
    setIsRenaming(false);
  };

  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  return (
    <div className={`${styles.outerDiv}`}>
      {conversations.map((conversation, index) => (
        <button
          key={index}
          className={`${styles.conversationButton} ${loading ? styles.disabledCursorNotAllowed : ""} ${selectedConversation.id === conversation.id ? styles.bg90 : ""}`}
          onClick={() => onSelectConversation(conversation)}
          disabled={loading}
        >
          <Message className="" />

          {isRenaming && selectedConversation.id === conversation.id ? (
            <input
              className={`${styles.conversationInput}`}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={handleEnterDown}
              autoFocus
            />
          ) : (
            <div className={`${styles.conversationText}`}>{conversation.name}</div>
          )}

          {(isDeleting || isRenaming) && selectedConversation.id === conversation.id && (
            <div className={`${styles.iconContainer}`}>
              <Check
                className={`${styles.icon}`}
                onClick={(e) => {
                  e.stopPropagation();

                  if (isDeleting) {
                    onDeleteConversation(conversation);
                  } else if (isRenaming) {
                    handleRename(conversation);
                  }

                  setIsDeleting(false);
                  setIsRenaming(false);
                }}
              />

              <Close
                className={`${styles.icon}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleting(false);
                  setIsRenaming(false);
                }}
              />
            </div>
          )}

          {selectedConversation.id === conversation.id && !isDeleting && !isRenaming && (
            <div className={`${styles.iconContainer}`}>
              <Edit
                className={`${styles.icon}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenaming(true);
                  setRenameValue(selectedConversation.name);
                }}
              />

              <DeleteOutline
                className={`${styles.icon}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleting(true);
                }}
              />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
