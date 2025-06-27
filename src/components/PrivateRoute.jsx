import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../Context/AppContext';

const PrivateRoute = ({ children }) => {
  const { user, institute, loading } = useApp();
  const location = useLocation();

  // Wait for Context to load before making access decision
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  // Redirect to login if no valid user or institute
  if (!user || !institute?.institute_uuid) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Render the protected page
  return children;
};

export default PrivateRoute;
