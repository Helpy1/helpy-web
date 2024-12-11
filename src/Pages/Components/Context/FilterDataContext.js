import React, { createContext, useContext, useState } from 'react';

// Create a context
const FilterDataContext = createContext();

// Create a provider component
export const FilterDataProvider = ({ children }) => {
  const [filterData, setFilterData] = useState(null);

  return (
    <FilterDataContext.Provider value={{ filterData, setFilterData }}>
      {children}
    </FilterDataContext.Provider>
  );
};

// Custom hook to use the filter data
export const useFilterData = () => {
  const context = useContext(FilterDataContext);
  if (!context) {
    throw new Error("useFilterData must be used within a FilterDataProvider");
  }
  return context;
};
