import { useEffect, useState } from 'react';
import BASE_URL from '../config'; // Adjust the path based on your folder structure


export default function Navbar() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('organization_title') || localStorage.getItem('name') || '';
    const userType = localStorage.getItem('type') || '';
    setUsername(name);
    setRole(userType);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome{username ? `, ${username}` : ''}
        </h2>
        {role && (
          <p className="text-sm text-gray-500">Role: {role}</p>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        Logout
      </button>
    </header>
  );
}
