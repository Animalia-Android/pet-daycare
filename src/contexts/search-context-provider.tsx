'use client';

import React, { createContext, useState } from 'react';

type SearchContextProvider = {
  children: React.ReactNode;
};

type TSearchContext = {
  searchQuery: string;
  handleChangeSearchQuery: (query: string) => void;
  // You can add more properties or methods as needed
};

export const SearchContext = createContext<TSearchContext | null>(null);

export default function SearchContextProvider({
  children,
}: SearchContextProvider) {
  //state
  const [searchQuery, setSearchQuery] = useState<string>('');

  //derived state or methods

  //event handlers
  const handleChangeSearchQuery = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, handleChangeSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
