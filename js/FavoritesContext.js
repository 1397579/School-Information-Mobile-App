import React, { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use favorites in any file
export const useFavorites = () => useContext(FavoritesContext);