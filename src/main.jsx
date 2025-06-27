import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import BrandingProvider from './context/BrandingContext'; // ✅ Default export
import { AppProvider } from './context/Appcontext'; // ✅ Named export

import './index.css'; // Tailwind CSS

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <BrandingProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </BrandingProvider>
    </BrowserRouter>
  </React.StrictMode>
);
