import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { pathname } = useLocation();
  const navItems = [
    { path: '/dashboard', label: 'Owner' },
    { path: '/dashboard/user', label: 'User' },
    { path: '/dashboard/admin', label: 'Admin' },
    { path: '/dashboard/superadmin', label: 'Superadmin' },
    { path: '/dashboard/brand', label: 'Brand' },
    { path: '/dashboard/student', label: 'Student' },
    { path: '/dashboard/reseller', label: 'Reseller' },
    { path: '/dashboard/faculty', label: 'Faculty' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h1 className="text-xl font-bold mb-6">My Dashboard</h1>
      <nav className="space-y-2">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`block p-2 rounded hover:bg-gray-100 ${
              pathname === item.path ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
