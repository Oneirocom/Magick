import { Conversation } from "../../../../types";
import { FileDownload } from '@mui/icons-material'

import { FC } from "react";
import { ClearConversations } from "./ClearConversations";
import { Import } from "./Import";
import { SidebarButton } from "./SidebarButton";

interface Props {
  onClearConversations: () => void;
  onExportConversations: () => void;
  onImportConversations: (conversations: Conversation[]) => void;
}

export const SidebarSettings: FC<Props> = ({ onClearConversations, onExportConversations, onImportConversations }) => {
  return (
    <div className="flex flex-col pt-1 items-center border-t border-white/20 text-sm space-y-1">
      <ClearConversations onClearConversations={onClearConversations} />

      <Import onImport={onImportConversations} />

      <SidebarButton
        text="Export conversations"
        icon={<FileDownload />}
        onClick={() => onExportConversations()}
      />
    </div>
  );
};
