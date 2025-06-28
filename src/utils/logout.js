const logoutUser = () => {
  // Clear user object (most important for PrivateRoute)
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');

  // Clear other related values
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_type');
  localStorage.removeItem('login_username');
  localStorage.removeItem('institute_id');
  localStorage.removeItem('institute_uuid');
  localStorage.removeItem('institute_title');
  localStorage.removeItem('theme_color');
  localStorage.removeItem('remember_me');
  localStorage.removeItem('last_password_change');

  sessionStorage.removeItem('user_id');
  sessionStorage.removeItem('user_name');
  sessionStorage.removeItem('user_type');
  sessionStorage.removeItem('login_username');
  sessionStorage.removeItem('institute_id');
  sessionStorage.removeItem('institute_uuid');
  sessionStorage.removeItem('institute_title');
  sessionStorage.removeItem('theme_color');

  // Reset AppContext if used
  if (window.updateAppContext) {
    window.updateAppContext({ user: null, institute: null });
  }

  // Redirect to login
  window.location.href = '/';
};

export default logoutUser;
