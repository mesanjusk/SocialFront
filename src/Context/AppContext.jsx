import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const remember = localStorage.getItem('remember_me') === 'true';
    const storage = remember ? localStorage : sessionStorage;

    const user_id = storage.getItem('user_id');
    const institute_uuid = storage.getItem('institute_uuid');

    if (user_id && institute_uuid) {
      const storedUser = {
        id: user_id,
        name: storage.getItem('user_name'),
        role: storage.getItem('user_type'),
        username: storage.getItem('login_username'),
      };

      const storedInstitute = {
        institute_id: storage.getItem('institute_id'),
        institute_uuid,
        institute_title: storage.getItem('institute_title'),
        theme_color: storage.getItem('theme_color'),
      };

      setUser(storedUser);
      setInstitute(storedInstitute);
      console.log('[AppContext] Restored from', remember ? 'localStorage' : 'sessionStorage');
    } else {
      console.warn('[AppContext] No stored user or institute found');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    window.updateAppContext = ({ user, institute }) => {
      if (user) setUser(user);
      if (institute) setInstitute(institute);
    };
  }, []);

  return (
    <AppContext.Provider value={{ user, institute, loading, setUser, setInstitute }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
