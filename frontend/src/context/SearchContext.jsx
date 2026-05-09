/* SearchContext — menaxhon kerkime dhe filtrime te produkteve */
import { createContext, useContext, useState } from "react";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  /* Pastro krejt filtrat */
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        clearFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch duhet brenda SearchProvider");
  return ctx;
};
