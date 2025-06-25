import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import BASE_URL from '../config';
import logoutUser from '../utils/logout';

export default function Navbar({ toggleSidebar }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('name') || localStorage.getItem('institute_title') || '';
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
              if (dbDate.toISOString() !== localDate.toISOString()) {
                alert('Your password was changed. Please login again.');
                logoutUser();
              }
            }
          }
        })
        .catch(err => {
          console.error('Auto logout check failed:', err);
        });
    }
  }, []);

  return (
    <>
      <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center z-30 relative">
        {/* Left side */}
        <div className="flex items-center gap-3">
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
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Logout
        </button>
      </header>

      {/* 🔒 Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={logoutUser}
                className="px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
