import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [institute, setInstitute] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = {
      id: localStorage.getItem('user_id'),
      name: localStorage.getItem('user_name'),
      role: localStorage.getItem('user_type'),
      username: localStorage.getItem('login_username')
    };

    const storedInstitute = {
      institute_id: localStorage.getItem('institute_id'),
      institute_uuid: localStorage.getItem('institute_uuid'),
      institute_title: localStorage.getItem('institute_title'),
      theme_color: localStorage.getItem('theme_color')
    };

    if (storedUser?.id) setUser(storedUser);
    if (storedInstitute?.institute_uuid) setInstitute(storedInstitute);
  }, []);

  // Allow global updates (used after login/signup)
  useEffect(() => {
    window.updateAppContext = ({ user, institute }) => {
      if (user) setUser(user);
      if (institute) setInstitute(institute);
    };
  }, []);

  return (
    <AppContext.Provider value={{ user, institute, setUser, setInstitute }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
