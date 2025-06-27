import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/BrandingContext';
import { AppProvider } from './context/Appcontext';

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
