import React, { createContext, useContext, useState, useEffect } from 'react';

// Default filter values
const defaultFilterValues = {
  fullName: '',
  minAge: 18,
  maxAge: 70,
  city: '',
  country: '',
  distance: '',
  longitude: null, // Added longitude
  latitude: null,  // Added latitude
  occupation: null,
  lookingFor: null,
  ethnicity: null,
  language: null,
  heightInInches: null,
  minHeightInInches: 48,
  maxHeightInInches: 96,
  selectedItems: [],
  bodyType: null,
  smoking: null,
  drinking: null,
  relationshipStatus: null,
  education: null,
  children: null,
};

// Create a Context for the Filters
const FilterContext = createContext();

// Provider Component
export const FilterProvider = ({ children }) => {
  // Load filters from localStorage or use default values
  const loadFiltersFromLocalStorage = () => {
    const storedFilters = localStorage.getItem('filters');
    return storedFilters ? JSON.parse(storedFilters) : defaultFilterValues;
  };

  const [filters, setFilters] = useState(loadFiltersFromLocalStorage);

  /**
   * Update filters by merging the new values with the existing ones.
   * @param {Object} newFilters - Object containing filter fields to update.
   */
  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };

      // Save updated filters to localStorage
      localStorage.setItem('filters', JSON.stringify(updatedFilters));

      return updatedFilters;
    });
  };

  /**
   * Reset filters to their default values.
   */
  const resetFilters = () => {
    setFilters(defaultFilterValues);
    // Optionally reset localStorage
    localStorage.setItem('filters', JSON.stringify(defaultFilterValues));
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilters, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook to use the FilterContext
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
