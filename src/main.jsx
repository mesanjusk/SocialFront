import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import BrandingProvider from './Context/BrandingContext'; // ✅ Default export
import { AppProvider } from './Context/AppContext'; // ✅ Named export

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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(() => {
      if (Notification && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    });
  });
}
