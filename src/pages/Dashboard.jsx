import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api/dashboard-stats'; // Update as per your backend

const Dashboard = () => {
  const navigate = useNavigate();

  // Safe JSON parse for institute
  let instituteObj = {};
  try { instituteObj = JSON.parse(localStorage.getItem('institute')) || {}; } catch {}
  const instituteName = instituteObj.institute_name ||
    localStorage.getItem('institute_title') ||
    'Your Institute';

  const expiryDateStr =
    localStorage.getItem('expiry_date') ||
    localStorage.getItem('trialExpiresAt');
  const planType = localStorage.getItem('plan_type');

  // Dashboard stats state
  const [stats, setStats] = useState({
    students: null,
    admissions: null,
    courses: null,
    enquiries: null,
    feesToday: null,
    followupToday: null,
    attendance: [],
  });
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    // Plan logic
    if (planType === 'trial' && expiryDateStr) {
      const expiryDate = new Date(expiryDateStr);
      const today = new Date();
      const diffTime = expiryDate.getTime() - today.getTime();
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (days <= 0) {
        setExpired(true);
        localStorage.setItem('plan_type', 'free');
      } else {
        setDaysLeft(days);
      }
    }
    // Dashboard stats fetch
    fetch(API_URL)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        setStats({
          students: data.students ?? 0,
          admissions: data.admissions ?? 0,
          courses: data.courses ?? 0,
          enquiries: data.enquiries ?? 0,
          feesToday: data.feesToday ?? 0,
          followupToday: data.followupToday ?? 0,
          attendance: Array.isArray(data.attendance) ? data.attendance : [],
        });
      })
      .catch(() => {
        setStats({
          students: 0,
          admissions: 0,
          courses: 0,
          enquiries: 0,
          feesToday: 0,
          followupToday: 0,
          attendance: [],
        });
      })
      .finally(() => setLoading(false));
  }, [planType, expiryDateStr]);

  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Trial Expired</h2>
          <p className="text-gray-600 mb-4">
            Your trial has ended. Please contact support to upgrade your plan.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // For skeleton loading effect
  const skeleton = (
    <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
  );

  // Helper to display values or skeleton
  const display = (val, isMoney = false) =>
    loading
      ? skeleton
      : isMoney
        ? `₹${(val || 0).toLocaleString()}`
        : (val || 0);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* Institute name on top */}
        <div className="text-2xl font-semibold text-center my-6">{instituteName}</div>
        {/* Days left on trial */}
        {planType === 'trial' && daysLeft !== null && (
          <div className="text-center text-orange-500 mb-2">
            {daysLeft} day{daysLeft !== 1 && 's'} left in your free trial
          </div>
        )}
        {/* Attendance Board */}
        <div className="bg-white p-4 rounded-2xl shadow w-full md:w-2/3 mx-auto mt-4 mb-6">
          <h2 className="text-xl font-bold mb-2 text-gray-800">Today's Attendance</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-12 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : stats.attendance.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {stats.attendance.map((entry, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center py-2 px-4 rounded ${
                    entry.status === "Present"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  <span>{entry.name}</span>
                  <span className="font-semibold">{entry.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 py-4 text-center">No attendance data found.</div>
          )}
        </div>
        {/* Dashboard Cards */}
        <main className="flex-1 p-4 bg-gray-50">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl shadow flex flex-col items-start">
              <div className="text-sm text-gray-400 mb-2">Total Students</div>
              <div className="text-3xl font-bold text-green-600">
                {display(stats.students)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow flex flex-col items-start">
              <div className="text-sm text-gray-400 mb-2">Total Admissions</div>
              <div className="text-3xl font-bold text-blue-600">
                {display(stats.admissions)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow flex flex-col items-start">
              <div className="text-sm text-gray-400 mb-2">Active Courses</div>
              <div className="text-3xl font-bold text-purple-600">
                {display(stats.courses)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow flex flex-col items-start">
              <div className="text-sm text-gray-400 mb-2">No. of Enquiries</div>
              <div className="text-3xl font-bold text-orange-500">
                {display(stats.enquiries)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl shadow flex flex-col">
              <div className="text-sm text-gray-400 mb-2">Today's Fees Collection</div>
              <div className="text-3xl font-bold text-green-700 mb-4">
                {display(stats.feesToday, true)}
              </div>
              <button
                onClick={() => navigate('/fees')}
                className="mt-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                View Details
              </button>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow flex flex-col">
              <div className="text-sm text-gray-400 mb-2">Today's Follow-up</div>
              <div className="text-3xl font-bold text-blue-700 mb-4">
                {display(stats.followupToday)}
              </div>
              <button
                onClick={() => navigate('/followup')}
                className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                View Followups
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
