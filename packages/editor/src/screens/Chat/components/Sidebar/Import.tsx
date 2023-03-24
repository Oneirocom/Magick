import { Conversation } from "../../../../types";
import { FileUpload } from '@mui/icons-material'
import { FC } from "react";

interface Props {
  onImport: (conversations: Conversation[]) => void;
}

export const Import: FC<Props> = ({ onImport }) => {
  return (
    <div className="flex py-3 px-3 gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer w-full items-center">
      <input
        className="opacity-0 absolute w-[200px] cursor-pointer"
        type="file"
        accept=".json"
        onChange={(e) => {
          if (!e.target.files?.length) return;

          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (e) => {
            const conversations: Conversation[] = JSON.parse(e.target?.result as string);
            onImport(conversations);
          };
          reader.readAsText(file);
        }}
      />
      <div className="flex items-center gap-3 text-left">
        <FileUpload />
        <div>Import conversations</div>
      </div>
    </div>
  );
};
