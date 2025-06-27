import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const remember = localStorage.getItem('remember_me') === 'true';
    const storage = remember ? localStorage : sessionStorage;

    const storedUser = storage.getItem('user');
    const storedInstitute = storage.getItem('institute');

    if (storedUser && storedInstitute) {
      try {
        setUser(JSON.parse(storedUser));
        setInstitute(JSON.parse(storedInstitute));
        console.log('[AppContext] Restored user/institute from', remember ? 'localStorage' : 'sessionStorage');
      } catch (err) {
        console.error('[AppContext] Failed to parse stored user/institute:', err);
      }
    } else {
      console.warn('[AppContext] No stored user or institute found');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    window.updateAppContext = ({ user, institute }) => {
      setUser(user);
      setInstitute(institute);

      const remember = localStorage.getItem('remember_me') === 'true';
      const storage = remember ? localStorage : sessionStorage;

      if (user) storage.setItem('user', JSON.stringify(user));
      if (institute) storage.setItem('institute', JSON.stringify(institute));
    };
  }, []);

  return (
    <AppContext.Provider value={{ user, institute, loading, setUser, setInstitute }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
