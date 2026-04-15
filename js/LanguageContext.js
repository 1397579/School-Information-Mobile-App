import React, { createContext, useState, useContext } from 'react';

// 1. Create the Context object
const LanguageContext = createContext();

// 2. Create a Provider component
export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('EN');

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 3. Create a custom hook for easy access in other files
export const useLanguage = () => useContext(LanguageContext);