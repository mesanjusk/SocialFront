import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const instituteName = localStorage.getItem('institute_title') || 'Your Institute';
  const userType = localStorage.getItem('type') || 'User';
  const expiryDateStr = localStorage.getItem('expiry_date');
  const planType = localStorage.getItem('plan_type');

  const [daysLeft, setDaysLeft] = useState(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
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
  }, [planType, expiryDateStr]);

  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-bold text-red-600">Trial Expired</h2>
          <p className="mt-2 text-gray-700">Your 14-day trial has ended. Please contact support to upgrade your plan.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:opacity-90"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-primary">Welcome, {instituteName}</h1>
      <p className="text-lg text-gray-700">Role: {userType}</p>

      {planType === 'trial' && expiryDateStr && (
        <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
          <p><strong>Trial Plan:</strong> Expires on {new Date(expiryDateStr).toLocaleDateString()}</p>
          <p>{daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining</p>
        </div>
      )}
      
    </div>
  );
};

export default Dashboard;
