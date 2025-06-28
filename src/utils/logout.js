const logoutUser = () => {
  // Clear localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('institute');
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

  // Reset AppContext
  if (window.updateAppContext) {
    window.updateAppContext({ user: null, institute: null });
  }

  // Redirect to login
  window.location.href = '/';
};

export default logoutUser;
