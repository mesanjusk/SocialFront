import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import BrandingProvider from './Context/BrandingContext';
import { AppProvider } from './Context/AppContext';
import MetadataProvider from './Context/MetadataContext';

import './index.css'; // Tailwind CSS

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <BrandingProvider>
        <AppProvider>
          <MetadataProvider>
            <App />
          </MetadataProvider>
        </AppProvider>
      </BrandingProvider>
    </BrowserRouter>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        if (Notification && Notification.permission === 'default') {
          Notification.requestPermission();
        }
      })
      .catch(err => {
        console.error('Service worker registration failed:', err);
      });
  });
}
