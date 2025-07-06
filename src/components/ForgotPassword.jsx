import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';
import { useApp } from '../Context/AppContext';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { institute } = useApp();
  const themeColor = institute?.theme_color || '#d0e0e3';

  const [centerCode, setCenterCode] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [serverOtp, setServerOtp] = useState('');
  const [userId, setUserId] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/institute/forgot-password`, {
        center_code: centerCode,
        mobile,
      });

      if (res.data.message === 'verified') {
        toast.success('OTP sent to registered mobile number');
        setOtpSent(true);
        setServerOtp(res.data.otp); // ⚠️ For development/testing only — remove in production
        setUserId(res.data.user_id);
      } else {
        toast.error(res.data.message || 'Verification failed');
      }
    } catch (err) {
      toast.error('Server error');
      console.error(err);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (!otp || otp !== serverOtp) {
      toast.error('Invalid OTP');
      return;
    }

    toast.success('OTP verified. Redirecting...');
    navigate(`/reset-password/${userId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: themeColor }}>
      <Toaster position="top-center" />
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: themeColor }}>
          Forgot Password
        </h2>

        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
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

          {otpSent && (
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
              className="w-full px-3 py-2 border rounded-md shadow-sm"
              style={{ boxShadow: `0 0 0 1.5px ${themeColor}` }}
              required
            />
          )}

          <button
            type="submit"
            className="w-full text-white py-2 rounded-md transition hover:opacity-90"
            style={{ backgroundColor: themeColor }}
          >
            {otpSent ? 'Verify OTP' : 'Send OTP'}
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
