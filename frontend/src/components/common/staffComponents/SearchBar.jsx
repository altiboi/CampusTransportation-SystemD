// src/components/common/SearchBar.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ onSearch }) => {
  const handleChange = (event) => {
    onSearch(event.target.value); // Pass the search term to parent component
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center border border-gray-300 bg-white rounded-full overflow-hidden">
        <FontAwesomeIcon icon={faSearch} className="text-gray-500 px-4 py-2" />
        <input
          type="text"
          placeholder="Search..."
          onChange={handleChange}
          className="flex-1 px-4 py-2 border-none outline-none bg-white text-black"
        />
      </div>
    </div>
  );
};

export default SearchBar;
