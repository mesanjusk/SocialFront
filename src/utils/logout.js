// src/utils/logout.js
export default function logoutUser() {
  // Clear user and org data
  localStorage.removeItem('user_id');
  localStorage.removeItem('name');
  localStorage.removeItem('type');
  localStorage.removeItem('last_password_change');
  localStorage.removeItem('institute_id');
  localStorage.removeItem('institute_title');
  localStorage.removeItem('theme_color');

  // Reset theme color
  document.documentElement.style.setProperty('--theme-color', '#10B981');

  // Redirect to login
  window.location.href = '/';
}
