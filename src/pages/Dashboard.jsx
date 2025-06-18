import React from 'react';

const Dashboard = () => {
  const organizationName = localStorage.getItem('organization_title') || 'Your Organization';
  const userType = localStorage.getItem('type') || 'User';

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-theme">Welcome, {organizationName}</h1>
      <p className="text-lg text-gray-700">Role: {userType}</p>
    </div>
  );
};

export default Dashboard;
