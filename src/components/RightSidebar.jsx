import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

// MUI Icons (Optional - You can change or add more)
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function RightSidebar() {
  const { pathname } = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const userType = localStorage.getItem('type');

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const rightNavItems = [
    {
      label: 'Account',
      items: [
        { path: '/dashboard/profile', label: 'My Profile', icon: <AccountCircleIcon fontSize="small" /> },
        ...(userType === 'admin'
          ? [{ path: '/dashboard/notifications', label: 'Notifications', icon: <NotificationsIcon fontSize="small" /> }]
          : [])
      ]
    },
    {
      label: 'Help',
      items: [
        { path: '/dashboard/help', label: 'Support', icon: <HelpOutlineIcon fontSize="small" /> },
      ]
    }
  ];

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-white shadow-md p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-6 text-right">Options</h1>

      <nav className="space-y-4">
        {rightNavItems.map((menu, idx) => (
          <div key={idx}>
            <button
              onClick={() => toggleMenu(menu.label)}
              className="w-full flex justify-between items-center font-semibold px-2 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              {menu.label}
              <span>{openMenus[menu.label] ? '−' : '+'}</span>
            </button>
            <div className={`${openMenus[menu.label] ? 'block' : 'hidden'} mt-2 space-y-1 ml-3`}>
              {menu.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 p-2 rounded hover:bg-gray-100 ${
                    pathname === item.path ? 'bg-gray-200 font-semibold' : ''
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
