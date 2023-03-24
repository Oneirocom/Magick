import { Close } from '@mui/icons-material'
import { FC } from "react";
import styles from './styles.module.css';

interface Props {
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
}

export const Search: FC<Props> = ({ searchTerm, onSearch }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    onSearch("");
  };

  return (
    <div className="relative flex items-center">
      <input
        className="flex-1 w-full pr-10 bg-[#202123] border border-neutral-600 text-sm rounded-md px-4 py-3 text-white"
        type="text"
        placeholder="Search conversations..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {searchTerm && (
        <Close
          className="absolute right-4 text-neutral-300 cursor-pointer hover:text-neutral-400"
          onClick={clearSearch}
        />
      )}
    </div>
  );
};
