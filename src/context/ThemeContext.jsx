import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ color: '#f3f4f6', setColor: () => {} });

export const ThemeProvider = ({ children }) => {
  const [color, setColor] = useState(() => localStorage.getItem('themeBg') || '#f3f4f6');

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-bg', color);
    localStorage.setItem('themeBg', color);
  }, [color]);

  return (
    <ThemeContext.Provider value={{ color, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
