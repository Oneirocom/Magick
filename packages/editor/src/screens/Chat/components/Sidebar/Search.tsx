import React, { FC } from "react";
import { Close } from '@mui/icons-material'
import searchStyles from "./styles.module.css";

interface Props {
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
}

export const Search: FC<Props> = ({ searchTerm, onSearch }) => {

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    onSearch('');
  };

  return (
    <div className={searchStyles.searchWrapper}>
      <input
        className={searchStyles.searchInput}
        type="text"
        placeholder="Search conversations..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {searchTerm && (
        <Close
          className={searchStyles.closeIcon}
          onClick={clearSearch}
        />
      )}
    </div>
  );
};

export default Search;