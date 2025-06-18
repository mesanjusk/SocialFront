import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';

const Login = () => {
  const navigate = useNavigate();
  const [centerCode, setCenterCode] = useState('');
  const [password, setPassword] = useState('');
  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current?.focus();

    // Prevent login skip if not an actual session
    const storedId = localStorage.getItem('organization_id');
    const storedType = localStorage.getItem('type');
    if (storedId && storedType === 'organization') {
      navigate('/dashboard', { state: { id: storedId } });
    }

    // Reset theme color to neutral before login
    document.documentElement.style.setProperty('--theme-color', '#10B981');
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/organization/login`, {
        center_code: centerCode,
        password: password,
      });

      const data = res.data;

      if (data.message !== 'success') {
        toast.error(data.message || 'Invalid credentials');
        return;
      }

      // Save session details
      localStorage.setItem('organization_id', data.organization_id);
      localStorage.setItem('organization_title', data.organization_title);
      localStorage.setItem('center_code', centerCode);
      localStorage.setItem('type', 'admin');
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('user_name', data.user_name);
      localStorage.setItem('user_type', data.user_type);
      localStorage.setItem('last_password_change', data.last_password_change);

      // ✅ Apply and store theme color only after login
      const themeColor = data.theme_color || '#10B981';
      localStorage.setItem('theme_color', themeColor);
      document.documentElement.style.setProperty('--theme-color', themeColor);

      toast.success('Login successful');
      setTimeout(() => {
        navigate('/dashboard', { state: { id: data.organization_id } });
      }, 800);
    } catch (err) {
      toast.error('Login failed. Try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <Toaster position="top-center" />
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center text-theme mb-6">Organization Login</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Center Code</label>
            <input
              ref={nameInputRef}
              type="text"
              value={centerCode}
              onChange={(e) => setCenterCode(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              placeholder="Enter center code"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              placeholder="Enter password"
            />
          </div>

          <div className="text-right text-sm">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-theme text-white py-2 rounded-md transition hover:opacity-90"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?
          <button
            onClick={() => navigate('/signup')}
            className="ml-1 text-blue-600 hover:underline font-medium"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
