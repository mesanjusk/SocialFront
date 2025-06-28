import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [branding, setBranding] = useState(JSON.parse(localStorage.getItem('branding')) || null);
  const inputRef = useRef(null);

  const getInstituteId = () => {
    const fromQuery = searchParams.get('i');
    if (fromQuery) return fromQuery;

    const host = window.location.hostname;
    const parts = host.split('.');
    const subdomain = parts.length > 2 ? parts[0] : null;
    if (subdomain && subdomain !== 'www' && subdomain !== 'instify') return subdomain;

    return null;
  };

  const fetchBranding = async (insti) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/branding?i=${insti || 'default'}`);
      const data = res.data;
      const themeColor = data.theme?.color || '#10B981';

      localStorage.setItem('branding', JSON.stringify(data));
      localStorage.setItem('institute_title', data.institute || '');
      localStorage.setItem('theme_color', themeColor);
      localStorage.setItem('favicon', data.favicon || '');
      localStorage.setItem('logo', data.logo || '');

      setBranding(data);

      document.documentElement.style.setProperty('--theme-color', themeColor);
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = data.favicon || '/favicon.ico';
      document.title = `${data.institute || 'Instify'} | Instify`;

    } catch (err) {
      console.error('Branding fetch error:', err);
      toast.error('⚠️ Failed to load branding');
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    // Apply cached branding instantly
    if (branding?.theme?.color) {
      document.documentElement.style.setProperty('--theme-color', branding.theme.color);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const insti = getInstituteId();

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/user/login`, { username, password });
      const data = res.data;

      if (data.message !== 'success') {
        toast.error(data.message || 'Invalid credentials');
        return;
      }

      toast.success(`Welcome, ${data.user_name}`);

      const userObj = {
        id: data.user_id,
        name: data.user_name,
        role: data.user_role || 'admin',
        username: data.login_username,
      };

      const instituteObj = {
        institute_id: data.institute_id,
        institute_uuid: data.institute_uuid,
        institute_title: data.institute_name,
        theme_color: data.theme_color || '#10B981',
      };

      document.documentElement.style.setProperty('--theme-color', data.theme_color || '#10B981');

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('remember_me', 'true');
      storage.setItem('user', JSON.stringify(userObj));
      storage.setItem('institute', JSON.stringify(instituteObj));
      storage.setItem('name', data.user_name);
      storage.setItem('institute_title', data.institute_name);
      storage.setItem('institute_uuid', data.institute_uuid);
      storage.setItem('center_code', data.login_username);
      storage.setItem('user_type', data.user_role || 'admin');
      storage.setItem('login_username', data.login_username);
      storage.setItem('theme_color', data.theme_color || '#10B981');
      storage.setItem('institute_id', data.institute_id || '');
      if (data.trialExpiresAt) {
        storage.setItem('trialExpiresAt', data.trialExpiresAt);
      }

      if (window.updateAppContext) {
        window.updateAppContext({ user: userObj, institute: instituteObj });
      }

      // Fetch branding after login for faster initial page load
      fetchBranding(insti);

      setTimeout(() => navigate('/dashboard'), 600);

    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || 'Server error during login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <Toaster position="top-center" />
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
        <div className="flex justify-center mb-6">
          <img src={branding?.logo || '/logo.png'} alt="Logo" className="w-20 h-20 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: branding?.theme?.color || '#10B981' }}>
          {branding?.institute || 'Login'}
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">Username</label>
            <input
              ref={inputRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none"
              placeholder="Enter username"
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
                placeholder="Enter password"
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
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              id="rememberMe"
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700">Keep me logged in</label>
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
            className="w-full py-2 rounded text-white"
            style={{ backgroundColor: branding?.theme?.color || '#10B981' }}
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
