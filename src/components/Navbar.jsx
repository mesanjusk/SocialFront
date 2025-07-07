import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useApp } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import logoutUser from '../utils/logout';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import { FaHeart } from "react-icons/fa";

export default function Navbar({ toggleSidebar }) {
  const { user, institute, loading } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showMasterItems, setShowMasterItems] = useState(false);
  const [showSettingsItems, setShowSettingsItems] = useState(false);
  const navigate = useNavigate();

  const instituteTitle =
    institute?.institute_title || institute?.institute_name || 'Your Institute';

  const username = user?.name || 'User';
  const role = user?.role || '';

  const toggleDrawer = () => setIsOpen(!isOpen);

  if (loading) {
    return (
      <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center z-30">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
      </header>
    );
  }

  return (
    <>
      <header className="bg-white  px-4 py-3 flex justify-between items-center z-30 relative">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={toggleSidebar}>
            {/* sidebar icon here if needed */}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="font-bold text-lg text-blue-600 hover:underline focus:outline-none"
          >
            {instituteTitle}
          </button>
        </div>

        <div className="flex items-center pr-3 gap-4 relative">

          {/* 1. Square 'F' */}
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => {/* your action here */ }}
          >
            <div className="w-8 h-8 bg-blue-200 flex items-center justify-center rounded text-lg font-bold text-blue-700">
              F
            </div>
          </button>

          {/* 2. Heart Icon */}
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => {/* your action here */ }}
          >
            <FaHeart className="text-2xl text-red-500" />
          </button>

          {/* 3. User Icon */}
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => setShowUserMenu((v) => !v)}
          >
            <AccountCircleIcon className="text-3xl text-blue-500" />
          </button>

          {/* Drawer/menu icon */}
          <button onClick={toggleDrawer} className="text-2xl focus:outline-none">
            <MenuIcon />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute top-12 right-0 w-56 bg-white rounded-lg  z-50 p-4">
                <div className="mb-2">
                  <div className="font-semibold text-gray-800">{username}</div>
                  {role && <div className="text-xs text-gray-500 capitalize">{role}</div>}
                </div>
                <button
                  onClick={logoutUser}
                  className="w-full text-left px-4 py-2 rounded bg-green-50 hover:bg-green-100 text-green-600 font-medium mt-2"
                >
                  Mark Attadance
                </button>
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

      {/* Right Drawer */}
      {isOpen && (
        <>
          <div className="absolute top-12 right-0 w-56 bg-white rounded-lg  z-50 p-4">
            {/* Master Section */}
            <div>
              <div
                className="font-semibold text-gray-700 mb-2 cursor-pointer hover:underline"
                onClick={() => setShowMasterItems(!showMasterItems)}
              >
                Master {showMasterItems}
              </div>
              {showMasterItems && (
                <div className="space-y-2 pl-2">
                  {[
                    { path: '/dashboard/Courses', label: 'Courses', icon: <EventNoteIcon fontSize="small" /> },
                    { path: '/dashboard/Batches', label: 'Batches', icon: <EventNoteIcon fontSize="small" /> },
                    { path: '/dashboard/allbatches', label: 'Manage Batches', icon: <EventNoteIcon fontSize="small" /> },
                    { path: '/dashboard/allexams', label: 'Manage Exams', icon: <EventNoteIcon fontSize="small" /> },
                    { path: '/dashboard/education', label: 'Education', icon: <SchoolIcon fontSize="small" /> },
                    { path: '/dashboard/exam', label: 'Exam', icon: <EventNoteIcon fontSize="small" /> },
                  ].map((item) => (
                    <div
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
                    >
                      {item.icon}
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings Section */}
            <div>
              <div
                className="font-semibold text-gray-700 mb-2 cursor-pointer hover:underline"
                onClick={() => setShowSettingsItems(!showSettingsItems)}
              >
                Settings {showSettingsItems}
              </div>
              {showSettingsItems && (
                <div className="space-y-2 pl-2">
                  <div
                    onClick={() => {
                      navigate('/dashboard/user');
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
                  >
                    <GroupIcon fontSize="small" />
                    User
                  </div>

                  {user?.role === 'admin' && (
                    <div
                      onClick={() => {
                        navigate('/dashboard/instituteProfile');
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
                    >
                      <EventNoteIcon fontSize="small" />
                      Profile
                    </div>
                  )}

                  {user?.role === 'owner' && (
                    <div
                      onClick={() => {
                        navigate('/dashboard/Owner');
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
                    >
                      <EventNoteIcon fontSize="small" />
                      Owner
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Overlay */}
          <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black opacity-25 z-40" />
        </>
      )}
    </>
  );
}
