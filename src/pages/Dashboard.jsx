import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const [stats, setStats] = useState({ enquiries: 0, admissions: 0, leads: 0 });
  const [activities, setActivities] = useState([
    'User John added',
    'Enquiry received from Alice',
    'Admission confirmed for Ramesh',
  ]);
  const [events, setEvents] = useState([
    { date: '2025-06-18', label: 'Admission Orientation' },
    { date: '2025-06-20', label: 'Parent-Teacher Meeting' },
  ]);

  const organizationId = localStorage.getItem('organization_id');
  const organizationTitle = localStorage.getItem('organization_title') || 'Organization';
  const centerCode = localStorage.getItem('center_code');
  const planType = localStorage.getItem('plan_type') || 'free';

  useEffect(() => {
    const type = localStorage.getItem('type');
    if (!type || type !== 'organization' || !organizationId) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://socialbackend-iucy.onrender.com/api/auth/GetUserList/${organizationId}`
        );
        if (res.data.success) {
          setTotalUsers(res.data.result.length);
        }

        // Replace below with real endpoints if available
        setStats({ enquiries: 42, admissions: 19, leads: 33 });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard stats');
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const chartData = [
    { name: 'Leads', value: stats.leads },
    { name: 'Enquiries', value: stats.enquiries },
    { name: 'Admissions', value: stats.admissions },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{organizationTitle} Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500 text-sm">Users</h3>
          <p className="text-3xl font-bold text-green-600">{totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500 text-sm">Plan Type</h3>
          <p className="text-xl font-semibold capitalize text-blue-600">{planType}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500 text-sm">Center Code</h3>
          <p className="text-xl font-semibold text-purple-600">{centerCode}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500 text-sm">Organization</h3>
          <p className="text-lg font-semibold text-gray-700">{organizationTitle}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">📈 Monthly Overview</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#34d399" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Activities */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">🔔 Recent Activity</h2>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {activities.map((act, i) => (
              <li key={i}>{act}</li>
            ))}
          </ul>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">📅 Upcoming Events</h2>
          <ul className="text-sm text-gray-600">
            {events.map((event, i) => (
              <li key={i} className="mb-1">
                <span className="font-medium text-gray-800">{event.date}:</span> {event.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
