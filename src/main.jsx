import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AppLoader from './components/AppLoader'; // ✅ Make sure the path is correct
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppLoader>
      <App />
    </AppLoader>
  </BrowserRouter>
);
