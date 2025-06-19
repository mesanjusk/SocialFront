import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import BASE_URL from '../config';

export default function Navbar({ toggleSidebar }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('name') || localStorage.getItem('organization_title') || '';
    const userType = localStorage.getItem('type') || '';
    setUsername(name);
    setRole(userType);

    const user_id = localStorage.getItem('user_id');
    const lastStored = localStorage.getItem('last_password_change');

    if (user_id && lastStored) {
      fetch(`${BASE_URL}/api/auth/${user_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.result?.last_password_change) {
            const dbDate = new Date(data.result.last_password_change);
            const localDate = new Date(lastStored);

            if (!isNaN(dbDate) && !isNaN(localDate)) {
              const dbTime = dbDate.toISOString();
              const localTime = localDate.toISOString();

              if (dbTime !== localTime) {
                alert('Your password was changed. Please login again.');
                handleLogout();
              }
            } else {
              console.warn('Invalid date format for password change check');
            }
          }
        })
        .catch(err => {
          console.error('Auto logout check failed:', err);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center z-30 relative">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Hamburger icon on mobile */}
        <button className="md:hidden" onClick={toggleSidebar}>
          <MenuIcon />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Welcome{username ? `, ${username}` : ''}
          </h2>
          {role && (
            <p className="text-sm text-gray-500 capitalize">{role}</p>
          )}
        </div>
      </div>

      {/* Right side - Logout */}
      <button
        onClick={handleLogout}
        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        Logout
      </button>
    </header>
  );
}
