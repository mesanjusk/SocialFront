import { useState, useRef, useEffect } from 'react';
import BASE_URL from '../config'; // Adjust the path based on your folder structure


const Superadmin = () => {
  const themeColor = localStorage.getItem('theme_color') || '#10B981';

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: themeColor }}>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Super Admin page </h1>
      </div>
    
    </div>
  );
};

export default Superadmin;
