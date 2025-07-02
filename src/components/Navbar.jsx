import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useApp } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import logoutUser from '../utils/logout';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';

export default function Navbar({ toggleSidebar }) {
  const { user, institute, loading } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Controls full menu drawer
  const [showAcademicItems, setShowAcademicItems] = useState(false); // Toggle Academic
  const [showSettingsItems, setShowSettingsItems] = useState(false); // Toggle Settings
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
      <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center z-30 relative">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={toggleSidebar}>
            <MenuIcon />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="font-bold text-lg text-blue-600 hover:underline focus:outline-none"
          >
            {instituteTitle}
          </button>
        </div>

        <div className="flex items-center gap-4 relative">
         
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => setShowUserMenu((v) => !v)}
          >
            <AccountCircleIcon className="text-3xl text-blue-500" />
          </button>
           <button onClick={toggleDrawer} className="text-2xl focus:outline-none">
            &#x22EE;
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-12 w-56 bg-white rounded-lg shadow-lg z-50 p-4">
                <div className="mb-2">
                  <div className="font-semibold text-gray-800">{username}</div>
                  {role && <div className="text-xs text-gray-500 capitalize">{role}</div>}
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

      {/* Right Drawer */}
      {isOpen && (
        <>
          <div className="fixed top-12 right-0 w-64 h-[90vh] bg-white z-50 shadow-lg overflow-y-auto p-4 space-y-4">
            {/* Academic Section */}
            <div>
              <div
                className="font-semibold text-gray-700 mb-2 cursor-pointer hover:underline"
                onClick={() => setShowAcademicItems(!showAcademicItems)}
              >
                Academic {showAcademicItems}
              </div>
              {showAcademicItems && (
                <div className="space-y-2 pl-2">
                  {[
                    { path: '/dashboard/Courses', label: 'Courses', icon: <EventNoteIcon fontSize="small" /> },
                    { path: '/dashboard/Batches', label: 'Batches', icon: <EventNoteIcon fontSize="small" /> },
                    { path: '/dashboard/paymentmode', label: 'Payment Mode', icon: <EventNoteIcon fontSize="small" /> },
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
