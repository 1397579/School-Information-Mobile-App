import React, { createContext, useState, useContext } from 'react';

const SchoolContext = createContext();

export const SchoolProvider = ({ children }) => {
  const [schools, setSchools] = useState([]);
  const [filtered, setFiltered] = useState([]);

  return (
    <SchoolContext.Provider value={{ schools, setSchools, filtered, setFiltered }}>
      {children}
    </SchoolContext.Provider>
  );
};

// Custom hook to use favorites in any file
export const useSchool = () => useContext(SchoolContext);
