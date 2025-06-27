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
      // Read from JSON keys
      const userStr = storage.getItem('user');
      const instiStr = storage.getItem('institute');

      if (userStr && instiStr) {
        const userObj = JSON.parse(userStr);
        const instiObj = JSON.parse(instiStr);

        // Fallback: If missing `institute_uuid` inside JSON, get from legacy storage
        if (!instiObj.institute_uuid) {
          const legacyUuid = storage.getItem('institute_uuid') || localStorage.getItem('institute_uuid');
          if (legacyUuid) {
            instiObj.institute_uuid = legacyUuid;
          }
        }

        setUser(userObj);
        setInstitute(instiObj);

        console.log('✅ [AppContext] Restored user and institute:', { userObj, instiObj });
      } else {
        console.warn('⚠️ [AppContext] No stored user or institute found in storage.');
      }
    } catch (err) {
      console.error('❌ [AppContext] Failed parsing user/institute:', err);
    } finally {
      setLoading(false);
    }
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
        // Ensure `institute_uuid` is saved separately for legacy dependencies
        if (institute.institute_uuid) {
          storage.setItem('institute_uuid', institute.institute_uuid);
        }
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
