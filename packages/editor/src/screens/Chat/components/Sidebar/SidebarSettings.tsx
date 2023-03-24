import { FileDownload } from '@mui/icons-material'

import { FC } from "react";
import { ClearConversations } from "./ClearConversations";
// import { Import } from "./Import";
import { SidebarButton } from "./SidebarButton";
import styles from './styles.module.css';

import { Conversation } from "../../../../types";

interface Props {
  onClearConversations: () => void;
  onExportConversations: () => void;
  onImportConversations: (conversations: Conversation[]) => void;
}

export const SidebarSettings: FC<Props> = ({ onClearConversations, onExportConversations, onImportConversations }) => {
  return (

    <div className={styles.bottomButtons}>
      <ClearConversations onClearConversations={onClearConversations} />

      {/* <Import onImport={onImportConversations} /> */}

      <SidebarButton
        text="Export conversations"
        icon={<FileDownload />}
        onClick={() => onExportConversations()}
      />
    </div>
  );
};
