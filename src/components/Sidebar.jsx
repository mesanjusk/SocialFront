import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventNoteIcon from '@mui/icons-material/EventNote';

export default function Sidebar() {
  const { pathname } = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const navItems = [
    {
      label: 'Main', items: [
        { path: '/dashboard', label: 'Owner', icon: <HomeIcon fontSize="small" /> },
        { path: '/dashboard/user', label: 'User', icon: <GroupIcon fontSize="small" /> },
        { path: '/dashboard/admin', label: 'Admin', icon: <AdminPanelSettingsIcon fontSize="small" /> },
        { path: '/dashboard/superadmin', label: 'Superadmin', icon: <AdminPanelSettingsIcon fontSize="small" /> },
      ]
    },
    {
      label: 'Academic', items: [
        { path: '/dashboard/brand', label: 'Brand', icon: <SchoolIcon fontSize="small" /> },
        { path: '/dashboard/student', label: 'Student', icon: <SchoolIcon fontSize="small" /> },
        { path: '/dashboard/reseller', label: 'Reseller', icon: <GroupIcon fontSize="small" /> },
        { path: '/dashboard/faculty', label: 'Faculty', icon: <GroupIcon fontSize="small" /> },
      ]
    },
    {
      label: 'Admissions', items: [
        { path: '/dashboard/Enquiry', label: 'Enquiry', icon: <ContactMailIcon fontSize="small" /> },
        { path: '/dashboard/Admission', label: 'Admission', icon: <MenuBookIcon fontSize="small" /> },
        { path: '/dashboard/Courses', label: 'Courses', icon: <EventNoteIcon fontSize="small" /> },
        { path: '/dashboard/Batches', label: 'Batches', icon: <EventNoteIcon fontSize="small" /> },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h1 className="text-xl font-bold mb-6">My Dashboard</h1>
      <nav className="space-y-4">
        {navItems.map((menu, idx) => (
          <div key={idx}>
            <button
              onClick={() => toggleMenu(menu.label)}
              className="w-full flex justify-between items-center font-semibold px-2 py-2 bg-theme rounded hover:bg-gray-200"
            >
              {menu.label}
              <span>{openMenus[menu.label] ? '−' : '+'}</span>
            </button>
            <div className={`${openMenus[menu.label] ? 'block' : 'hidden'} mt-2 space-y-1 ml-3`}>
              {menu.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 p-2 rounded hover:bg-theme ${
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
