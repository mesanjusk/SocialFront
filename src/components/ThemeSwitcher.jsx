import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  const { color, setColor } = useTheme();

  const handleChange = (e) => {
    setColor(e.target.value);
  };

  return (
    <input
      type="color"
      value={color}
      onChange={handleChange}
      className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
      aria-label="Choose theme color"
    />
  );
};

export default ThemeSwitcher;
