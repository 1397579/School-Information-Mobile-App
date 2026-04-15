import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedMode = await AsyncStorage.getItem('darkMode');
      if (savedMode !== null) {
        setDarkMode(savedMode === 'true');
      }
    };
    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    await AsyncStorage.setItem('darkMode', JSON.stringify(nextMode));
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={darkMode ? '#000' : '#fff'}
      />
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);