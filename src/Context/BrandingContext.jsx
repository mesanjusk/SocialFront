import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

export const BrandingContext = createContext();

const defaultTheme = {
  color: '#10B981', // fallback green
  logo: '/logo.png',
  favicon: '/favicon.ico',
  institute: 'Instify'
};

function hexToRgb(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b}`;
}

const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState(defaultTheme);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/branding`);
        const data = res.data || {};

        const final = {
          institute: data.institute || defaultTheme.institute,
          color: data.theme?.color || defaultTheme.color,
          logo: data.logo || defaultTheme.logo,
          favicon: data.favicon || defaultTheme.favicon
        };

        setBranding(final);

        // Set CSS variable dynamically
        const rgb = hexToRgb(final.color);
        document.documentElement.style.setProperty('--tw-color-primary', rgb);

        // Set favicon and title
        if (final.favicon) {
          const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
          link.rel = 'icon';
          link.href = final.favicon;
          document.head.appendChild(link);
        }
        document.title = `${final.institute} | Instify`;

      } catch (err) {
        console.warn('⚠️ Failed to fetch branding, using default.');
        const rgb = hexToRgb(defaultTheme.color);
        document.documentElement.style.setProperty('--tw-color-primary', rgb);
        setBranding(defaultTheme);
      }
    };

    fetchBranding();
  }, []);

  return (
    <BrandingContext.Provider value={{ branding }}>
      {children}
    </BrandingContext.Provider>
  );
};

export default BrandingProvider;
