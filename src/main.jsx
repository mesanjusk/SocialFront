import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import BrandingProvider from './Context/BrandingContext'; // ✅ make sure BrandingProvider is default export

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <BrandingProvider>
        <App />
      </BrandingProvider>
    </BrowserRouter>
  </React.StrictMode>
);
