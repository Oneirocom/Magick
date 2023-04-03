import { Conversation } from "../../../../types";
import { Add } from '@mui/icons-material'
import { FC } from "react";

interface Props {
  selectedConversation: Conversation;
  onNewConversation: () => void;
}

export const Navbar: FC<Props> = ({ selectedConversation, onNewConversation }) => {
  return (
    <nav className="flex justify-between bg-[#202123] py-3 px-4 w-full">
      <div className="mr-4"></div>

      <div className="max-w-[240px] whitespace-nowrap overflow-hidden text-ellipsis">{selectedConversation.name}</div>

      <Add
        className="cursor-pointer hover:text-neutral-400"
        onClick={onNewConversation}
      />
    </nav>
  );
};
