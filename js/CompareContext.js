import React, { createContext, useState, useContext } from 'react';

// 1. Create the Context object
const CompareContext = createContext();

// 2. Create a Provider component
export const CompareProvider = ({ children }) => {
  const [compare1, setCompare1] = useState('notSelect');
  const [compare2, setCompare2] = useState('notSelect');

  return (
    <CompareContext.Provider value={{ compare1, setCompare1, compare2, setCompare2 }}>
      {children}
    </CompareContext.Provider>
  );
};

// 3. Create a custom hook for easy access in other files
export const useCompare = () => useContext(CompareContext);