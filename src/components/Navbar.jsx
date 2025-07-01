import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useApp } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import logoutUser from '../utils/logout';

export default function Navbar({ toggleSidebar }) {
  const { user, institute, loading } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // While loading, show nothing or a skeleton/loading UI
  if (loading) {
    return (
      <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center z-30">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
      </header>
    );
  }

  // Safely handle fallback for institute name
  const instituteTitle =
    institute?.institute_title ||
    institute?.institute_name ||
    'Your Institute';

  const username = user?.name || 'User';
  const role = user?.role || '';

  return (
    <>
      <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center z-30 relative">
        {/* Left: Hamburger & Institute Name */}
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={toggleSidebar}>
            <MenuIcon />
          </button>
          {/* Institute Name - clickable */}
          <button
            onClick={() => navigate('/dashboard')}
            className="font-bold text-lg text-blue-600 hover:underline focus:outline-none"
          >
            {instituteTitle}
          </button>
        </div>

        {/* Right: User Menu Icon */}
        <div className="relative">
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => setShowUserMenu((v) => !v)}
          >
            <AccountCircleIcon className="text-3xl text-blue-500" />
          </button>
          {/* User Dropdown Menu */}
          {showUserMenu && (
            <>
              {/* Overlay (click outside to close) */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
                aria-label="Overlay"
              ></div>
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 p-4">
                <div className="mb-2">
                  <div className="font-semibold text-gray-800">{username}</div>
                  {role && (
                    <div className="text-xs text-gray-500 capitalize">{role}</div>
                  )}
                </div>
                <button
                  onClick={logoutUser}
                  className="w-full text-left px-4 py-2 rounded bg-red-50 hover:bg-red-100 text-red-600 font-medium mt-2"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}
