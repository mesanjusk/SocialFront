import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';
import { getInstituteId } from '../utils/instituteUtils';
import { fetchBranding } from '../utils/brandingUtils';
import { fetchAndStoreMasters } from '../utils/masterUtils';
import { storeUserData, storeInstituteData } from '../utils/storageUtils';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [branding, setBranding] = useState(JSON.parse(localStorage.getItem('branding')) || null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (branding?.theme?.color) {
      document.documentElement.style.setProperty('--theme-color', branding.theme.color);
    }
    const user = localStorage.getItem('user');
    const insti = localStorage.getItem('institute');
    if (user && insti) {
      navigate('/dashboard');
    }
  }, [navigate, branding]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const insti = getInstituteId(searchParams);
    try {
      // Make sure backend uses bcrypt.compare for hashed password check!
      const { data } = await axios.post(`${BASE_URL}/api/auth/user/login`, { username, password });
      if (data.message !== 'success') {
        toast.error(data.message || 'Invalid credentials');
        setLoading(false);
        return;
      }
      toast.success(`Welcome, ${data.user_name}`);
      storeUserData({
        id: data.user_id,
        name: data.user_name,
        role: data.user_role,
        username: data.login_username,
      });
      storeInstituteData({
        institute_uuid: data.institute_uuid,
        institute_name: data.institute_name,
        institute_id: data.institute_id,
        theme_color: data.theme_color,
      });
      if (data.trialExpiresAt) {
        localStorage.setItem('trialExpiresAt', data.trialExpiresAt);
      }
      document.documentElement.style.setProperty('--theme-color', data.theme_color || '#5b5b5b');
      if (window.updateAppContext) {
        window.updateAppContext({
          user: JSON.parse(localStorage.getItem('user')),
          institute: JSON.parse(localStorage.getItem('institute')),
        });
      }
      await fetchBranding(insti, setBranding);
      await fetchAndStoreMasters();
      setTimeout(() => navigate(`/${data.login_username}`), 600);
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || 'Server error during login');
    } finally {
      setPassword('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <Toaster position="top-center" />
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
        <div className="flex justify-center mb-6">
          <img src={branding?.logo || '/logo.png'} alt="Logo" className="w-20 h-20 object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: branding?.theme?.color || '#5b5b5b' }}>
          {branding?.institute || 'Login'}
        </h2>
        <div className="text-xs text-center mb-2 text-gray-500">
          (Login using your Center Code as both username and password)
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">Center Code</label>
            <input
              ref={inputRef}
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setPassword(e.target.value); // Optional: auto-fill password for easy login
              }}
              required
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none"
              placeholder="Enter Center Code"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none pr-10"
                placeholder="Enter Password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            style={{ backgroundColor: branding?.theme?.color || '#45818e' }}
          >
            {loading ? 'Logging in...' : 'Login'}
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
