import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a new context for liked items
const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState({});

  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem('favoriteItems');
      setFavoriteItems(storedFavorites ? JSON.parse(storedFavorites) : {});
    };
    loadFavorites();
  }, []);

  const updateFavorite = (itemId, isLiked) => {
    const updatedFavorites = { ...favoriteItems, [itemId]: isLiked };
    setFavoriteItems(updatedFavorites);
    localStorage.setItem('favoriteItems', JSON.stringify(updatedFavorites));
  };

  return (
    <FavoritesContext.Provider value={{ favoriteItems, updateFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
