"use client";

import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

interface SearchBarProps {
  search: string;
  setSearch: (search: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

const SearchBar = ({
  search,
  setSearch,
  placeholder,
  className,
  debounceMs = 350,
}: SearchBarProps) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Sync external search updates (e.g. parent clears filter or initial value)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce notification to parent
  useEffect(() => {
    if (localSearch === search) return;
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, search, setSearch, debounceMs]);

  const handleClear = () => {
    setLocalSearch("");
    setSearch("");
  };

  return (
    <span
      className={`flex items-center bg-white border border-gray-300 mx-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-full w-full transition-colors focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary ${
        className || ""
      }`}
    >
      <input
        type="text"
        placeholder={placeholder || "Cari event..."}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="outline-none w-full font-jakarta text-gray-800 text-sm sm:text-base bg-transparent"
      />
      {localSearch ? (
        <button
          type="button"
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600 mr-2 focus:outline-none"
          title="Hapus"
        >
          <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
        </button>
      ) : null}
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500"
      />
    </span>
  );
};

export default SearchBar;
