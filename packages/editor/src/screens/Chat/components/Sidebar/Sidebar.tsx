import { Conversation, KeyValuePair } from "../../../../types";
import { Add } from '@mui/icons-material'
import { FC, useEffect, useState } from "react";
import { Conversations } from "./Conversations";
import { Search } from "./Search";
import { SidebarSettings } from "./SidebarSettings";
import sidebarStyles from './styles.module.css';
import { Button } from '@magickml/client-core'

interface Props {
  loading: boolean;
  conversations: Conversation[];
  selectedConversation: Conversation;
  onNewConversation: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversation: Conversation) => void;
  onToggleSidebar: () => void;
  onUpdateConversation: (conversation: Conversation, data: KeyValuePair) => void;
  onClearConversations: () => void;
  onExportConversations: () => void;
  onImportConversations: (conversations: Conversation[]) => void;
}

export const Sidebar: FC<Props> = ({ loading, conversations, selectedConversation, onNewConversation, onSelectConversation, onDeleteConversation, onToggleSidebar, onUpdateConversation, onClearConversations, onExportConversations, onImportConversations }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>(conversations);

  useEffect(() => {
    if (searchTerm) {
      setFilteredConversations(conversations.filter((conversation) => {
        const searchable = conversation.name.toLocaleLowerCase() + ' ' + conversation.messages.map((message) => message.content).join(" ");
        return searchable.toLowerCase().includes(searchTerm.toLowerCase());
      }
      ));
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchTerm, conversations]);

  return (
    <aside className={sidebarStyles.sidebar}>
      <header className={sidebarStyles.header}>

        <Button
          className="small"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            onNewConversation();
            setSearchTerm("");
          }}
        >
          <Add className="" />
          New chat
        </Button>

      </header>

      {conversations.length > 1 && (
        <Search
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
        />
      )}

      <div className={sidebarStyles.conversationsContainer}>
        <Conversations
          loading={loading}
          conversations={filteredConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={onSelectConversation}
          onDeleteConversation={(conversation) => {
            onDeleteConversation(conversation);
            setSearchTerm("");
          }}
          onRenameConversation={(conversation, name) => {
            onUpdateConversation(conversation, { key: "name", value: name });
            setSearchTerm("");
          }}
        />
      </div>

      <SidebarSettings
        onClearConversations={onClearConversations}
        onExportConversations={onExportConversations}
        onImportConversations={onImportConversations}
      />
    </aside>
  );
};
