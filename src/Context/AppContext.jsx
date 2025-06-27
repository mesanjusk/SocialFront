import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const remember = localStorage.getItem('remember_me') === 'true';
    const storage = remember ? localStorage : sessionStorage;

    try {
      const userStr = storage.getItem('user');
      const instiStr = storage.getItem('institute');

      if (userStr && instiStr) {
        const userObj = JSON.parse(userStr);
        const instiObj = JSON.parse(instiStr);

        setUser(userObj);
        setInstitute(instiObj);

        console.log('✅ [AppContext] Restored from', remember ? 'localStorage' : 'sessionStorage');
      } else {
        console.warn('⚠️ [AppContext] No stored user or institute found');
      }
    } catch (err) {
      console.error('❌ [AppContext] Failed to parse stored values:', err);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    window.updateAppContext = ({ user, institute }) => {
      const remember = localStorage.getItem('remember_me') === 'true';
      const storage = remember ? localStorage : sessionStorage;

      if (user) {
        setUser(user);
        storage.setItem('user', JSON.stringify(user));
      }
      if (institute) {
        setInstitute(institute);
        storage.setItem('institute', JSON.stringify(institute));
      }
    };
  }, []);

  return (
    <AppContext.Provider value={{ user, institute, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
