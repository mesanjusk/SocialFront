// ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';

const ForgotPassword = () => {
  const [centerCode, setCenterCode] = useState('');
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();
  const themeColor = localStorage.getItem('theme_color') || '#10B981';

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/institute/forgot-password`, {
        center_code: centerCode,
        mobile,
      });

      if (res.data.message === 'verified') {
        toast.success('Verified. Now reset password.');
        navigate(`/reset-password/${res.data.user_id}`);
      } else {
        toast.error(res.data.message || 'Verification failed');
      }
    } catch (err) {
      toast.error('Error verifying user');
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: themeColor }}
    >
      <Toaster position="top-center" />
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-center text-theme mb-6">Forgot Password</h2>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={centerCode}
            onChange={(e) => setCenterCode(e.target.value)}
            placeholder="Center Code"
            required
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
            style={{ boxShadow: `0 0 0 1.5px ${themeColor}` }}
          />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Registered Mobile Number"
            required
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
            style={{ boxShadow: `0 0 0 1.5px ${themeColor}` }}
          />
          <button
            type="submit"
            className="w-full bg-theme text-white py-2 rounded-md transition hover:opacity-90"
          >
            Verify
          </button>
        </form>
        <div className="text-center mt-4 text-sm text-gray-600">
          Remembered your password?
          <button
            onClick={() => navigate('/')}
            className="ml-1 text-blue-600 hover:underline font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

