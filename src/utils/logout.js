// src/utils/logoutUser.js

import { clearUserAndInstituteData } from './storageUtils';

/**
 * Logs out the user safely by clearing all user/institute data,
 * resetting AppContext if available, and redirecting to login.
 */
const logoutUser = () => {
  // ✅ Clear user and institute data consistently
  clearUserAndInstituteData();

  // ✅ Clear additional related values if used
  localStorage.removeItem('remember_me');
  localStorage.removeItem('last_password_change');
  sessionStorage.removeItem('remember_me');
  sessionStorage.removeItem('last_password_change');

  // ✅ Reset AppContext if your app uses it
  if (window.updateAppContext) {
    window.updateAppContext({ user: null, institute: null });
  }

  // ✅ Redirect to login page
  window.location.href = '/';
};

export default logoutUser;
